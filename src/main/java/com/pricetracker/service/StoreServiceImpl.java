package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.StoreDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StoreServiceImpl implements StoreService{

    private final StoreRepo repo;
    public StoreServiceImpl ( StoreRepo storeRepo){
        this.repo = storeRepo;
    }

    @Override
    public Store getOrCreateStore(StoreDTO dto) {

        return repo.findByName(dto.getStore_name())

                .orElseGet(() -> {

                    Store s = new Store();
                    s.setId(dto.getStore_id());
                    s.setName(dto.getStore_name());
                    s.setBaseUrl(dto.getStore_domain());
                    s.setLogoUrl(dto.getImg_url());
                    return repo.save(s);
                });
    }

    @Override
    public  Optional<Store> getStoreById(Long Id){
        return repo.findById(Id);
    }

}