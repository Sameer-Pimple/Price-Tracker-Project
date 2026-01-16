package com.pricetracker.service;

import com.pricetracker.dto.ParsedData;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StoreService {

    private final StoreRepo storeRepository;

    public StoreService(StoreRepo storeRepository) {
        this.storeRepository = storeRepository;
    }


}
