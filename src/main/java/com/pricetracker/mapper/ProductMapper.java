package com.pricetracker.mapper;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductDTO dto) {
        Product p = new Product();
        p.setPid(dto.getPid());
        p.setTitle(dto.getTitle());
        p.setCategory(dto.getCat());
        p.setImg_url(dto.getImgurl());
        return p;
    }
}


