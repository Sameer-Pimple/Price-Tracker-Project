package com.pricetracker.service.ScrapersService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pricetracker.DTO.Flipshope.RootDTO;
import com.pricetracker.util.ScraperHelper;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
public class FlipshopeScraperService {
    private static final int AMAZON_SID = 2;
    private final ObjectMapper objectMapper;

    public FlipshopeScraperService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    // ===== PROXY LIST =====
    private static final List<String> PROXY_LIST = List.of(
            // "username:password@proxy-host:port",
            // "username:password@proxy-host:port"
    );
    public RootDTO scrapeFlipshopProduct(String userUrl) {
        WebDriver driver = null;

        try {

            if (userUrl == null || userUrl.isBlank()) {
                throw new RuntimeException("url is required in request body");
            }

            Random random = new Random();

            // ===== 4 DIFFERENT BROWSER USER-AGENTS =====
            String[] USER_AGENTS = {
                    // Chrome (Windows)
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

                    // Firefox (Windows)
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",

                    // Edge (Windows)
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"


            };

            String selectedUA = USER_AGENTS[random.nextInt(USER_AGENTS.length)];

            // ===== Chrome Options =====
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--disable-blink-features=AutomationControlled");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
        //    options.addArguments("--headless=new");

            // ===== Random window size (fingerprint break) =====
            int width = 1200 + random.nextInt(600);
            int height = 700 + random.nextInt(400);
            options.addArguments("--window-size=" + width + "," + height);

            // ===== Apply User-Agent =====
            options.addArguments("--user-agent=" + selectedUA);

            // ===== Proxy condition =====
            if (!PROXY_LIST.isEmpty()) {
                String selectedProxy = PROXY_LIST.get(
                        random.nextInt(PROXY_LIST.size())
                );

                Proxy proxy = new Proxy();
                proxy.setHttpProxy(selectedProxy);
                proxy.setSslProxy(selectedProxy);

                options.setProxy(proxy);
            }

            // ===== Start Driver =====
            driver = new ChromeDriver(options);
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

            // ===== Load Amazon page =====
            driver.get(userUrl);

            // short human-like pause
            Thread.sleep(1200 + random.nextInt(800));


            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("productTitle")));



            if (ScraperHelper.shouldScroll()) {
                ScraperHelper.randomScroll(driver);
            }

            // JavaScript Executer to gets values Using JS
            JavascriptExecutor js = (JavascriptExecutor) driver;

            //Rating
            String rating = "";
            try {
                rating = (String) js.executeScript("return document.querySelector('#acrPopover span.a-size-small.a-color-base').textContent;");
            } catch (Exception e) {
                log.error("Scraping Rating failed", e);
            }

            // Availability
            String availability = "";
            try {
                availability = driver.findElement(By.id("availability")).getText().trim();
            } catch (Exception ignored) {
            }


            // Discount
            String discount = "";
            try {
                discount = (String) js.executeScript("""
                            let el = document.querySelector('span.savingsPercentage');
                            if (!el) return '';
                            let txt = el.textContent;   // "-65%"
                            let nums = txt.match(/\\d+/g);
                            return nums ? nums.join('') : '';
                        """);
            } catch (Exception e) {
                log.error("Scraping Discount failed", e);
            }


            String title = driver.findElement(By.id("productTitle"))
                    .getText()
                    .trim();

            // ===== SEO slug =====
            String seoSlug = title
                    .toLowerCase()
                    .replaceAll("[.,/!]", "")
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .trim()
                    .replaceAll("\\s+", "-");

            // ===== Extract ASIN =====
            String asin = ScraperHelper.extractAsin(userUrl);
            if (asin == null) {
                throw new RuntimeException("ASIN not found in Amazon URL");
            }

            // Open Flipshope product page (NOT JSON) to extract buildId
            String flipshopePageUrl =
                    "https://flipshope.com/amazon--"
                            + seoSlug + "--"
                            + AMAZON_SID + "--"
                            + asin;

            driver.get(flipshopePageUrl);
            Thread.sleep(2000); // small wait for page load

            if (ScraperHelper.isBlocked(driver)) {
                throw new RuntimeException("FLIPSHOPE BLOCKED / CAPTCHA");
            }


// Extract fresh buildId dynamically
            String buildId = ScraperHelper.extractBuildId(driver);

// Now build JSON URL dynamically
            String flipshopeJsonUrl =
                    "https://flipshope.com/_next/data/"
                            + buildId + "/amazon--"
                            + seoSlug + "--"
                            + AMAZON_SID + "--"
                            + asin + ".json";


            // ===== Random delay =====
            Thread.sleep(2000 + random.nextInt(3000));

            // ===== Load Flipshope JSON =====
            driver.get(flipshopeJsonUrl);
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("pre")));

            String json = driver.findElement(By.tagName("pre")).getText();

            RootDTO dto = objectMapper.readValue(json, RootDTO.class);
            dto.setRating(rating);
            dto.setAvailability(availability);
            dto.setDiscount(discount);
            return dto;


        } catch (Exception e) {
            throw new RuntimeException("Flipshope scrape failed: " + e.getMessage(), e);
        }
        finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }

}
