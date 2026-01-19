package com.pricetracker.controller;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/flipshope")
public class FlipshopeAmazonController {

    // ===== CONSTANTS =====

    private static final int AMAZON_SID = 2;

    private static final Pattern ASIN_PATTERN =
            Pattern.compile("/([A-Z0-9]{10})(?:[/?]|$)");

    // ===== PROXY LIST =====
    // Empty list = direct IP
    private static final List<String> PROXY_LIST = List.of(
            // "username:password@proxy-host:port",
            // "username:password@proxy-host:port"
    );

    // ================= MAIN API =================
    @PostMapping(
            value = "/amazon",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )

    public String getFlipshopeJson(@RequestBody Map<String, String> body) {

        WebDriver driver = null;

        try {
            String productUrl = body.get("url");
            if (productUrl == null || productUrl.isBlank()) {
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
//            options.addArguments("--headless=new");

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
            driver.get(productUrl);

            // short human-like pause
            Thread.sleep(1200 + random.nextInt(800));
//
//            if (isBlocked(driver)) {
//                throw new RuntimeException("IP BLOCKED / CAPTCHA DETECTED");
//            }

            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("productTitle")));



            if (shouldScroll()) {
                randomScroll(driver);
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
            String asin = extractAsin(productUrl);
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

            if (isBlocked(driver)) {
                throw new RuntimeException("FLIPSHOPE BLOCKED / CAPTCHA");
            }


// Extract fresh buildId dynamically
            String buildId = extractBuildId(driver);

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

            return driver.findElement(By.tagName("pre")).getText();

        } catch (Exception e) {
            return """
                {
                  "error": "%s"
                }
                """.formatted(e.getMessage());
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }

    private void randomScroll(WebDriver driver) throws InterruptedException {
        Random random = new Random();
        JavascriptExecutor js = (JavascriptExecutor) driver;

        // total page height
        long height = (long) js.executeScript(
                "return document.body.scrollHeight");

        int scrollSteps = 3 + random.nextInt(5); // 3–7 scrolls

        long currentPosition = 0;

        for (int i = 0; i < scrollSteps; i++) {
            // random scroll distance
            long scrollBy = 200 + random.nextInt(500);
            currentPosition = Math.min(currentPosition + scrollBy, height);

            js.executeScript("window.scrollTo(0, arguments[0]);", currentPosition);

            // random human-like pause
            Thread.sleep(800 + random.nextInt(1200));
        }

        // thoda upar bhi scroll kar dete hain (very human)
        if (random.nextBoolean()) {
            js.executeScript("window.scrollTo(0, 0);");
            Thread.sleep(600 + random.nextInt(800));
        }
    }

    private boolean shouldScroll() {
        // 30–40% chance of scrolling
        return new Random().nextInt(100) < 35;
    }

    private boolean isBlocked(WebDriver driver) {
        String pageSource = driver.getPageSource().toLowerCase();

        return pageSource.contains("captcha")
                || pageSource.contains("robot check")
                || pageSource.contains("enter the characters")
                || pageSource.contains("sorry");
    }


    private String extractBuildId(WebDriver driver) {
        WebElement nextDataScript = driver.findElement(By.id("__NEXT_DATA__"));
        String json = nextDataScript.getAttribute("innerHTML");

        Pattern pattern = Pattern.compile("\"buildId\"\\s*:\\s*\"(.*?)\"");
        Matcher matcher = pattern.matcher(json);

        if (matcher.find()) {
            return matcher.group(1);
        }

        throw new RuntimeException("BuildId not found");
    }

    // ===== ASIN extractor =====
    private String extractAsin(String url) {
        Matcher matcher = ASIN_PATTERN.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
}
