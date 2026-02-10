package com.pricetracker.service;
import com.pricetracker.DTO.Flipshope.GraphDataDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;

import java.util.List;
import java.util.Optional;


public interface PriceHistoryService {

    void saveHistory(Product product, Store store, GraphDataDTO dto);

    void saveHistory(Product product, Store store, List<GraphDataDTO> graphList);

    List<PriceHistory> getHistoryByProductId(Long productId);
}