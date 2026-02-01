package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.entity.Product;

import java.util.Optional;

public interface ProductService{

    Product getOrCreateProduct(ProductDTO dto);

    Optional<Product> getProductById(Long id);

    Optional<Product> getProductByPid(String Pid);

}
