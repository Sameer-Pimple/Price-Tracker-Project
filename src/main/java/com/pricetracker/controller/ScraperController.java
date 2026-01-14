package com.pricetracker.controller;

import com.pricetracker.service.ScrapersService.AmazonScraperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scrape")
public class ScraperController {

    @Autowired
    private AmazonScraperService amazonScraperService; //Amz service jo Dependency inject ki hai

    // POST request to scrape Amazon product
    @PostMapping(value = "/amazon", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String scrapeAmazon(@RequestBody Map<String, String> request) {

        // User sent URL in JSON { "url": "https://www.amazon.in/dp/B0FMDL81GS" }
        String userUrl = request.get("url");

        // Call amz service to scrape data & return jsonString postman usko json me dikha raha hai yaha se string me hi ja raha hai..
        return amazonScraperService.scrapeAmazonProduct(userUrl);
    }
}

