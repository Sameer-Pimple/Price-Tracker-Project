package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.GraphDataDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import com.pricetracker.mapper.PriceHistoryMapper;
import com.pricetracker.repository.PriceHistoryRepo;
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
    public void saveHistory(Product product, Store store, GraphDataDTO dto) {
        if (dto == null) return;

        // Convert String time to LocalDate
        LocalDate graphDate = dto.getTime(); // assuming dto.getTime() format is "yyyy-MM-dd"

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
    public List<PriceHistory> getHistoryByProductId(Long productId) {

        return repo.findAllByProduct_IdOrderByDateAsc(productId);
    }
}