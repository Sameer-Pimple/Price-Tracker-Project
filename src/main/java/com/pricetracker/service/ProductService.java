package com.pricetracker.service;

import com.pricetracker.DTO.ProductDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.mapper.ProductMapper;
import com.pricetracker.repository.ProductRepo;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepo repo;
    private final ProductMapper mapper;

    public ProductService(ProductRepo repo, ProductMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public Product upsert(ProductDTO dto) {

        return repo.findByPid(dto.getPid())
                .map(existing -> {
                    existing.setTitle(dto.getTitle());
                    existing.setCategory(dto.getCat());
                    return repo.save(existing);
                })
                .orElseGet(() -> repo.save(mapper.toEntity(dto)));
    }
}
