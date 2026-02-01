package com.pricetracker.mapper;

import com.pricetracker.DTO.Flipshope.StoreDTO;
import com.pricetracker.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    public Store toEntity( StoreDTO dto ){
        Store s = new Store();
        s.setName(dto.getStore_name());
        s.setLogoUrl(dto.getImg_url());
        s.setBaseUrl(dto.getStore_domain());
        return s;
    }
}
