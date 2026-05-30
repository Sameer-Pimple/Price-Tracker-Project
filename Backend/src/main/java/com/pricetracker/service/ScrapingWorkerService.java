package com.pricetracker.service;

import com.pricetracker.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional; // ◄ Make sure it's this one

@Service
@RequiredArgsConstructor
@Slf4j
public class ScrapingWorkerService {
    private final PriceTrackingService priceTrackingService;

    @Async("scrapingExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW) // Isolates transaction bounds
    public void processProductAsync(String Pid) {

        if (Pid == null ) return;
        String productURL = "https://www.amazon.in/dp/" + Pid;

        try {
            log.info("Started scraping worker for Product PID: {}", Pid);

            priceTrackingService.trackByAmazonUrl(productURL);

            log.info("Successfully tracked and recorded price state metrics for product ID: {}", Pid);

            // 4. TODO: Fire event to trigger alert evaluations asynchronous notifications downstream

        } catch (Exception e) {
            log.error("Scraping operation failed for product ID {}. Resetting interval bounds. Error: {}", Pid, e.getMessage());
        }
    }
}
