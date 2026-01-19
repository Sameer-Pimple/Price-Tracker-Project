package com.pricetracker.service;

import com.pricetracker.DTO.ProductDTO;
import com.pricetracker.DTO.StoreDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

@Service
public interface StoreService {

    Store getOrCreateStore();
}

