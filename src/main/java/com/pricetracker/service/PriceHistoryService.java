package com.pricetracker.service;

import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import org.springframework.stereotype.Service;

@Service
public class PriceHistoryService {
    public void saveIfChanged(Product product, Store store, ParsedData data) {
    }
}
