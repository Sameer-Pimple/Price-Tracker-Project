package com.pricetracker.service;


import com.pricetracker.DTO.Flipshope.StoreDTO;
import com.pricetracker.entity.Store;

import java.util.Optional;

public interface StoreService {

    Store getOrCreateStore(StoreDTO dto);

    Optional<Store> getStoreById(Long Id);
}

