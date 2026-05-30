package com.pricetracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;
@Configuration
@EnableAsync
public class ThreadPoolConfig {
    @Bean(name = "scrapingExecutor")
    public Executor scrapingExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10); // 10 permanent worker threads
        executor.setMaxPoolSize(25);        // Extends up to 25 workers if queue overflows
        executor.setQueueCapacity(500);     // In-memory line capacity
        executor.setThreadNamePrefix("ScraperWorker-");
        executor.initialize();
        return executor;
    }
}
