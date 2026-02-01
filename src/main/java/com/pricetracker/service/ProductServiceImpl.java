package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.mapper.ProductMapper;
import com.pricetracker.repository.ProductRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepo repo;
    private final ProductMapper mapper;

    public ProductServiceImpl(ProductRepo repo, ProductMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public Product getOrCreateProduct(ProductDTO dto) {

        return repo.findByPid(dto.getPid())
                .orElseGet(() ->{
                    Product product = new Product();
                    product.setPid(dto.getPid());
                    product.setTitle(dto.getTitle());
                    product.setCategory(dto.getCat());
                    product.setImg_url(dto.getImgurl());
                    return repo.save(product);
                });
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Optional<Product> getProductByPid(String Pid) {
        return repo.findByPid(Pid);
    }


}
