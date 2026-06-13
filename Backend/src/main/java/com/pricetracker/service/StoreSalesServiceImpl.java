package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.StoreSaleDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.entity.StoreSales;
import com.pricetracker.mapper.StoreSalesMapper;
import com.pricetracker.repository.StoreRepo;
import com.pricetracker.repository.StoreSalesRepo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class StoreSalesServiceImpl implements StoreSalesService {

    private final StoreRepo storeRepo;
    private final StoreSalesRepo storeSalesRepo;
    private final StoreSalesMapper mapper;

    public StoreSalesServiceImpl(StoreRepo storeRepo,
                             StoreSalesRepo storeSalesRepo,
                             StoreSalesMapper mapper) {
        this.storeRepo = storeRepo;
        this.storeSalesRepo = storeSalesRepo;
        this.mapper = mapper;
    }
    @Override
    public void saveSales(StoreSaleDTO dto) {

        if (dto == null) return;

        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        StoreSales sale = mapper.toEntity(dto, store);
        storeSalesRepo.save(sale);
    }
    @Override
    public void saveSales(List<StoreSaleDTO> storeSaleList) {

        if (storeSaleList == null || storeSaleList.isEmpty()) return;

        for (StoreSaleDTO dto : storeSaleList){
            boolean exists = storeSalesRepo.existsBySaleNameAndStartDate(dto.getSale_name(), dto.getStart_date());

            if (!exists){
                saveSales(dto);
            }

        }
    }
    @Override
    @Cacheable(value = "storeSalesHistory", key = "#storeId + '_' + #date")
    public Optional<StoreSales> getSalesByStoreAndDate(Long storeId, LocalDateTime date){
        Optional<Store> store = storeRepo.findById(storeId);
        return storeSalesRepo.findByStoreAndStartDate(store, date);

    }

}