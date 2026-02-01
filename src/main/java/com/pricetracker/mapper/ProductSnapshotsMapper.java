package com.pricetracker.mapper;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.entity.Store;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ProductSnapshotsMapper {
    public ProductSnapshots toEntity(Product product, Store store, ProductDTO dto){
        ProductSnapshots p = new ProductSnapshots();
        p.setProduct(product);
        p.setStore(store);
        p.setPrice(dto.getPrice());
        p.setMRP(dto.getMrp());
        p.setRating(dto.getRating());
        p.setScapedAt(LocalDateTime.now());
        p.setDiscount(dto.getDiscount());
        return p;
    }
}
