package com.pricetracker.service;

import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

@Service
public class StoreService {

    private final StoreRepo storeRepository;

    public StoreService(StoreRepo storeRepository) {
        this.storeRepository = storeRepository;
    }


}
