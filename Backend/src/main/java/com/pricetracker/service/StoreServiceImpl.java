package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.StoreDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.StoreRepo;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepo repo;

    public StoreServiceImpl(StoreRepo storeRepo) {
        this.repo = storeRepo;
    }

    @Override
    // 1. Use @CachePut so that WHENEVER a new store is created, it is instantly pushed to Redis
    @CachePut(value = "Store", key = "#result.id")
    public Store getOrCreateStore(StoreDTO dto) {
        return repo.findByName(dto.getStore_name())
                .orElseGet(() -> {
                    Store s = new Store();
                    // Warning: Hardcoding ID to 2 will cause Database Primary Key violations!
                    // Let your database auto-increment the ID instead if possible.
                    s.setId(Long.valueOf(2));
                    s.setName(dto.getStore_name());
                    s.setBaseUrl(dto.getStore_domain());
                    s.setLogoUrl(dto.getImg_url());
                    return repo.save(s);
                });
    }

    @Override
    // 2. Change return type to Store (or handle Optional unwrapping) for smoother Jackson serialization
    @Cacheable(value = "Store", key = "#id")
    public Optional<Store> getStoreById(Long id) {
        return repo.findById(id);
    }
}