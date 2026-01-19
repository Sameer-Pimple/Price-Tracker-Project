package com.pricetracker.mapper;
import com.pricetracker.DTO.StoreSaleDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.entity.StoreSales;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class StoreSalesMapper {

    public StoreSales toEntity(StoreSaleDTO dto, Store store){
        StoreSales s = new StoreSales();

        s.setSaleName(dto.getSale_name());
        s.setStore(store);
        s.setStartDate(LocalDate.parse(dto.getStart_date()).atStartOfDay());
        s.setEndDate(LocalDate.parse(dto.getEnd_date()).atStartOfDay());
        return s;
    }
}
