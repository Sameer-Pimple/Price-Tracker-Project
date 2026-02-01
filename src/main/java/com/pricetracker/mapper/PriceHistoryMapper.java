package com.pricetracker.mapper;

import com.pricetracker.DTO.Flipshope.GraphDataDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PriceHistoryMapper {

    public PriceHistory toEntity(Product product, Store store, GraphDataDTO dto) {
        PriceHistory ph = new PriceHistory();
        ph.setProduct(product);
        ph.setStore(store);
        ph.setPrice(dto.getMin_price());
        ph.setDate(LocalDate.parse(dto.getTime()));
        return ph;
    }
}

