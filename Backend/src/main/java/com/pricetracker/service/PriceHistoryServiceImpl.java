package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.GraphDataDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import com.pricetracker.mapper.PriceHistoryMapper;
import com.pricetracker.repository.PriceHistoryRepo;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PriceHistoryServiceImpl implements PriceHistoryService {

    private final PriceHistoryRepo repo;
    private final PriceHistoryMapper mapper;

    public PriceHistoryServiceImpl(PriceHistoryRepo repo, PriceHistoryMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    // 1. Evict the cache when a single history record is saved
    @CacheEvict(value = "priceHistory", key = "#product.id")
    public void saveHistory(Product product, Store store, GraphDataDTO dto) {
        if (dto == null) return;

        LocalDate graphDate = dto.getTime();

        Optional<PriceHistory> latestOpt = repo.findTopByProductAndStoreOrderByDateDesc(product, store);

        boolean exists = latestOpt
                .map(ph -> ph.getDate().equals(graphDate))
                .orElse(false);

        if (exists) return;

        PriceHistory history = mapper.toEntity(product, store, dto);
        history.setDate(graphDate);

        repo.save(history);
    }

    @Override
    // 2. Evict the cache when a bulk list of history records is saved
    @CacheEvict(value = "priceHistory", key = "#product.id")
    public void saveHistory(Product product, Store store, List<GraphDataDTO> graphList) {
        if (graphList == null || graphList.isEmpty()) return;

        for (GraphDataDTO dto : graphList) {
            // Note: Calling a method annotated with caching from inside the same class
            // bypassing Spring's proxy, so the @CacheEvict on the single method won't fire here.
            // That is why putting @CacheEvict directly on this bulk method is required!
            saveHistory(product, store, dto);
        }
    }

    @Override
    @Cacheable(value = "priceHistory", key = "#productId")
    public List<PriceHistory> getHistoryByProductId(Long productId) {
        return repo.findAllByProduct_IdOrderByDateAsc(productId);
    }
}
