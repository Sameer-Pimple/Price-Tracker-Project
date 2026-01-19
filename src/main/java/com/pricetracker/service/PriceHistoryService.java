package com.pricetracker.service;

import com.pricetracker.DTO.GraphDataDTO;
import com.pricetracker.DTO.PagePropsDTO;
import com.pricetracker.DTO.ProductDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import com.pricetracker.mapper.PriceHistoryMapper;
import com.pricetracker.repository.PriceHistoryRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class PriceHistoryService {

    private final PriceHistoryRepo repo;
    private final PriceHistoryMapper mapper;

    public PriceHistoryService(PriceHistoryRepo repo,
                               PriceHistoryMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public void save(Product product, Store store, GraphDataDTO dto) {

        // optional: duplicate check
        Optional<PriceHistory> latestOpt =
                repo.findTopByProductAndStoreOrderByDateDesc(product, store);

        boolean exists = latestOpt
                .map(ph -> ph.getDate().equals(dto.getTime()))
                .orElse(false);


        if (exists) return;

        PriceHistory history = mapper.toEntity(product, store, dto);
        repo.save(history);
    }
}


