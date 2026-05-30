package com.pricetracker.Scheduler;


import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.repository.ProductSnapshotsRepo;
import com.pricetracker.service.ScrapingWorkerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class PriceTrackingScheduler {

    private final ProductSnapshotsRepo snapshotRepository;
    private final ScrapingWorkerService workerService;

    // Set delay timer interval window to repeat exactly once every 24 hours
//    @Scheduled(fixedDelay = 24 * 60 * 60 * 1000)
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void runDailyTrackingJob() {
        log.info("Initializing automated daily price monitoring distribution sequence...");

        // Target elements that haven't been touched within the last day loop window
        LocalDateTime dueTime = LocalDateTime.now().minusHours(24);
        int batchSize = 50;
        long totalDispatchedCount = 0;

        while (true) {
            // Pull safe isolated block from context logs
            List<ProductSnapshots> dueSnapshots = snapshotRepository.findDueSnapshots(dueTime, batchSize);

            // Escape routing condition once tracking queue limits empty out
            if (dueSnapshots.isEmpty()) {
                log.info("Processing pipeline iteration finalized. Total records allocated to pool: {}", totalDispatchedCount);
                break;
            }

            for (ProductSnapshots snapshot : dueSnapshots) {
                // Reserve row instantly to update timestamp context parameters
                snapshot.setScapedAt(LocalDateTime.now());
                snapshotRepository.save(snapshot);

                // Transfer execution tasks onto asynchronous thread queues safely
                workerService.processProductAsync(snapshot.getProduct().getPid());
                totalDispatchedCount++;
            }

            // Flush database buffers instantly to commit mutations to disk
            // before restarting the query loop context window
            snapshotRepository.flush();
        }
    }
}