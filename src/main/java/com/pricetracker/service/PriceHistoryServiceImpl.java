package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.GraphDataDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import com.pricetracker.mapper.PriceHistoryMapper;
import com.pricetracker.repository.PriceHistoryRepo;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PriceHistoryServiceImpl implements PriceHistoryService {

    private final PriceHistoryRepo repo;
    private final PriceHistoryMapper mapper;
    private final ProductRepo productRepo;
    private final StoreRepo storeRepo;

    public PriceHistoryServiceImpl(PriceHistoryRepo repo, PriceHistoryMapper mapper, ProductRepo productRepo,StoreRepo storeRepo) {
        this.repo = repo;
        this.mapper = mapper;
        this.productRepo = productRepo;
        this.storeRepo = storeRepo;
    }


    @Override
    public void saveHistory(Product product, Store store, GraphDataDTO dto) {
        if (dto == null) return;

        // Convert String time to LocalDate
        LocalDate graphDate = LocalDate.parse(dto.getTime()); // assuming dto.getTime() format is "yyyy-MM-dd"

        // Check if same date entry exists
        Optional<PriceHistory> latestOpt = repo.findTopByProductAndStoreOrderByDateDesc(product, store);

        boolean exists = latestOpt
                .map(ph -> ph.getDate().equals(graphDate))
                .orElse(false);

        if (exists) return;

        PriceHistory history = mapper.toEntity(product, store, dto);
        // Make sure mapper sets LocalDate date field from dto.getTime()
        history.setDate(graphDate);

        repo.save(history);
    }


    @Override
    public void saveHistory(Product product, Store store, List<GraphDataDTO> graphList) {

        if (graphList == null || graphList.isEmpty()) return;

        for (GraphDataDTO dto : graphList) {
            saveHistory(product, store, dto); // reuse existing logic
        }
    }


    @Override
    public List<PriceHistory> getHistory(Long productId, Long storeId) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        return repo.findByProductAndStoreOrderByDateAsc(product, store);
    }
}