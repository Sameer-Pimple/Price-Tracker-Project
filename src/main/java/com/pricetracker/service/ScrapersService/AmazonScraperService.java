package com.pricetracker.service.ScrapersService;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.pricetracker.service.Proxy.SeleniumDriverFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AmazonScraperService {
        // SeleniumDriverFactory custom browser settings banane ki factory
    private final SeleniumDriverFactory driverFactory;
    private final ObjectMapper mapper = new ObjectMapper();

    public AmazonScraperService(SeleniumDriverFactory driverFactory) {
        this.driverFactory = driverFactory;
    }

    public String scrapeAmazonProduct(String userUrl) {
        Map<String, String> result = new HashMap<>();
        WebDriver driver = null; //abhi browser driver band hai

        try {
            // Extract ASIN
            Pattern pattern = Pattern.compile("/dp/([A-Z0-9]{10})");
            Matcher matcher = pattern.matcher(userUrl);

            if (!matcher.find()) {
                result.put("error", "Invalid Amazon URL");
                return mapper.writeValueAsString(result);
            }

            String asin = matcher.group(1);
            String cleanUrl = "https://www.amazon.in/dp/" + asin;

            // Setup driver
            driver = driverFactory.createDriver();
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20)); // avoid long hang

            // Open product page
            driver.get(cleanUrl);
                // set default behaviour to wait for load page
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // Title
            String title = "";
            try {
                title = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("productTitle")))
                        .getText().trim();
            } catch (Exception ignored) {}

            // Price
            String price = "";
            try {
                wait.until(ExpectedConditions.or(
                        ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".a-price-whole")),
                        ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".a-price .a-offscreen")),
                        ExpectedConditions.visibilityOfElementLocated(By.id("priceblock_ourprice")),
                        ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#apexPriceToPay span"))
                ));

                try { price = driver.findElement(By.cssSelector(".a-price-whole")).getText() + "." +
                        driver.findElement(By.cssSelector(".a-price-fraction")).getText(); } catch(Exception ignored){}
                if(price.isEmpty()) try { price = driver.findElement(By.cssSelector(".a-price .a-offscreen")).getText(); } catch(Exception ignored){}
                if(price.isEmpty()) try { price = driver.findElement(By.id("priceblock_ourprice")).getText(); } catch(Exception ignored){}
                if(price.isEmpty()) try { price = driver.findElement(By.cssSelector("#apexPriceToPay span")).getText(); } catch(Exception ignored){}
            } catch (Exception ignored) {}

            // Availability
            String availability = "";
            try {
                availability = driver.findElement(By.id("availability")).getText().trim();
            } catch (Exception ignored) {}

            // Add in map to Build JSON
            result.put("platform", "AMAZON");
            result.put("asin", asin);
            result.put("clean_url", cleanUrl);
            result.put("title", title);
            result.put("price", price.isEmpty() ? "" : price);
            result.put("availability", availability);

        } catch (Exception e) {
            result.put("error", e.getMessage());
        } finally {
            //agar browser driver shuru hua to band bhi karna padega...
            if (driver != null) driver.quit();
        }

        try {
            return mapper.writeValueAsString(result);
        } catch (Exception e) {
            return "{\"error\":\"JSON conversion failed\"}";
        }
    }
}
