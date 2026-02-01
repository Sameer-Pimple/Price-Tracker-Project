package com.pricetracker.mapper;
import com.pricetracker.DTO.Flipshope.StoreSaleDTO;
import com.pricetracker.entity.Store;
import com.pricetracker.entity.StoreSales;
import org.springframework.stereotype.Component;

@Component
public class StoreSalesMapper {

    public StoreSales toEntity(StoreSaleDTO dto, Store store){
        StoreSales s = new StoreSales();
        s.setSaleName(dto.getSale_name());
        s.setStore(store);
        s.setStartDate(dto.getStart_date());
        s.setEndDate(dto.getEnd_date());
        return s;
    }
}