package com.pricetracker.service;

import com.pricetracker.DTO.StoreDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

@Service
public class StoreServiceImpl {

    private final StoreRepo repo;
    private StoreServiceImpl ( StoreRepo storeRepo){
        this.repo = storeRepo;
    }

    public Store getOrCreateStore(StoreDTO dto) {

        return repo.findByName(dto.getStore_name())
                .orElseGet(() -> {
                    Store s = new Store();
                    s.setName(dto.getStore_name());
                    s.setBaseUrl(dto.getImg_url());
                    s.setLogoUrl(dto.getImg_url());
                    return repo.save(s);
                });
    }
}
