package com.pricetracker.service.ScrapersService;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.pricetracker.DTO.Amazon.ScraperDTO;
import com.pricetracker.service.Proxy.SeleniumDriverFactory;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.regex.Matcher;

import java.util.regex.Pattern;

@Slf4j
@Service
public class AmazonScraperService {
    // SeleniumDriverFactory custom browser settings banane ki factory
    private final SeleniumDriverFactory driverFactory;
    private final ObjectMapper mapper = new ObjectMapper();

    public AmazonScraperService(SeleniumDriverFactory driverFactory) {
        this.driverFactory = driverFactory;
    }


    public Optional<ScraperDTO> scrapeAmazonProduct(String userUrl) {

        ScraperDTO dto = new ScraperDTO();
        WebDriver driver = null; //abhi browser driver band hai

        try {
            // Extract ASIN
            Pattern pattern = Pattern.compile("/dp/([A-Z0-9]{10})");
            Matcher matcher = pattern.matcher(userUrl);

            if (!matcher.find()) {
                return Optional.of(dto);
            }
            //ASIN
            String asin = matcher.group(1);
            String cleanUrl = "https://www.amazon.in/dp/" + asin;

            // Setup driver
            driver = driverFactory.createDriver();
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20)); // avoid long hang

            // Open product page
            driver.get(cleanUrl);
            // set default behaviour to wait for load page
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // JavaScript Execute to gets values Using JS
            JavascriptExecutor js = (JavascriptExecutor) driver;

            // Price
            String price = "";
            try {
                price = (String) js.executeScript("""
                            let el =
                                document.querySelector('#apexPriceToPay span.a-offscreen') ||
                                document.querySelector('.a-price .a-offscreen');
                        
                            if (!el) return '';
                        
                            // sirf rupees part lo (decimal se pehle)
                            let text = el.textContent;
                            let rupees = text.split('.')[0];   // ₹2,499.00 -> ₹2,499
                            let nums = rupees.match(/\\d+/g);
                            return nums ? nums.join('') : '';
                        """);
            } catch (Exception e) {
                log.error("Scraping Price failed", e);
            }


            //Rating
            String rating = "";
            try {
                rating = (String) js.executeScript("return document.querySelector('#acrPopover span.a-size-small.a-color-base').textContent;");
            } catch (Exception e) {
                log.error("Scraping Rating failed", e);
            }

            //MRP
            String mrp = "";
            try {
                mrp = (String) js.executeScript("""
                            let el = document.querySelector(
                                'span.a-price.a-text-price span.a-offscreen'
                            );
                            if (!el) return '';
                        
                            let match = el.textContent.match(/\\d+/g);
                            return match ? match.join('') : '';
                        """);
            } catch (Exception e) {
                log.error("Scraping MRP failed", e);
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


            dto.setPrice(Integer.valueOf(price));
            dto.setMRP(Integer.valueOf(mrp));
            dto.setRating(Double.valueOf(rating));
            dto.setAvailability(availability);
            dto.setDiscount(Integer.valueOf(discount));
            return Optional.of(dto);
        } catch (Exception e) {
            log.error("Scraping failed", e);
            return Optional.empty();
        } finally {
            //agar browser driver shuru hua to band bhi karna padega...
            if (driver != null) driver.quit();
        }

    }
}
