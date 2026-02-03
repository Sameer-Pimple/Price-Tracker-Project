package com.pricetracker.util;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
public class ScraperHelper {
    private static final Pattern ASIN_PATTERN =
            Pattern.compile("/([A-Z0-9]{10})(?:[/?]|$)");


    public static void randomScroll(WebDriver driver) throws InterruptedException {
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

    public static boolean shouldScroll() {
        // 30–40% chance of scrolling
        return new Random().nextInt(100) < 35;
    }

    public static boolean isBlocked(WebDriver driver) {
        String pageSource = driver.getPageSource().toLowerCase();

        return pageSource.contains("captcha")
                || pageSource.contains("robot check")
                || pageSource.contains("enter the characters")
                || pageSource.contains("sorry");
    }


    public static String extractBuildId(WebDriver driver) {
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
    public static String extractAsin(String url) {
        Matcher matcher = ASIN_PATTERN.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
}
