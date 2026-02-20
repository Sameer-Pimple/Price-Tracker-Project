package com.pricetracker.service.Proxy;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Random;

@Component
public class SeleniumDriverFactory {

    // Add proxies here or leave empty to get direct local IP
    private final List<String> proxies = List.of(
            ""
            // "username:password@proxy-host:port",
            // "username:password@proxy-host:port"
    );

    public WebDriver createDriver() {
        ChromeOptions options = new ChromeOptions();
    //    options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--blink-settings=imagesEnabled=false"); // images skip karega → faster hoga
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0 Safari/537.36");
        options.addArguments("accept-language=en-US,en;q=0.9");

        // Use proxy if valid, else local IP
        String proxy = proxies.isEmpty() ? "" : proxies.get(new Random().nextInt(proxies.size()));
        if (!proxy.isEmpty()) {
            options.addArguments("--proxy-server=" + proxy);
        } else {
            System.out.println("Using local IP, no proxy applied");
        }
            //WebDriver me custom settings behavior and rule ke sath options pass kiye
        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20));

        return driver;
    }
}
