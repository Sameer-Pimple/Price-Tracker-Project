package com.pricetracker.service;

import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.ProductSnapshotsRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScrapingWorkerService {
    private final PriceTrackingService priceTrackingService;
    private final ProductRepo productRepo;
    private final ProductSnapshotsRepo snapshotsRepo;
    private final UserAlertService userAlertService;

    @Async("scrapingExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processProductAsync(String Pid) {

        if (Pid == null ) return;
        String productURL = "https://www.amazon.in/dp/" + Pid;

        try {
            log.info("Started scraping worker for Product PID: {}", Pid);

            priceTrackingService.trackByAmazonUrl(productURL);

            log.info("Successfully tracked and recorded price state metrics for product ID: {}", Pid);

              // 2. Fetch product & latest snapshot price
            productRepo.findByPid(Pid).ifPresent(product -> {
                snapshotsRepo.findByProduct(product).ifPresent(snapshot -> {
                    Double currentPrice = snapshot.getPrice() != null ? snapshot.getPrice().doubleValue() : null;
                    
                    // 3. Check and send emails
                    if (currentPrice != null) {
                        userAlertService.checkAndTriggerAlerts(product, currentPrice);
                    }
                });
            });
            
        } catch (Exception e) {
            log.error("Scraping operation failed for product ID {}. Resetting interval bounds. Error: {}", Pid, e.getMessage());
        }
    }
}
