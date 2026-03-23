package com.pricetracker.Scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PriceCheckScheduler {

    @Autowired
    public ProductService productService;

    @Scheduled(fixedDelay = 120000) // 2 min
    public void runPriceCheck() {
        productService.checkPrices();
    }

}
