package com.pricetracker.service;


import com.pricetracker.DTO.Flipshope.StoreSaleDTO;
import com.pricetracker.entity.StoreSales;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StoreSalesService {

    void saveSales(StoreSaleDTO dto);

    void saveSales(List<StoreSaleDTO> storeSaleList);

    Optional<StoreSales> getSalesByStoreAndDate(Long storeId, LocalDateTime date);
}
