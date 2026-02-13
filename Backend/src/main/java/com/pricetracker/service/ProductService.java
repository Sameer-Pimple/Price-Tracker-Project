package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.DTO.ProductDetailsDTO;
import com.pricetracker.DTO.ProductListDTO;
import com.pricetracker.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService{

    Product getOrCreateProduct(ProductDTO dto);

    Optional<Product> getProductById(Long id);

    Optional<Product> getProductByPid(String Pid);

    List<Product> getAllProduct();

    ProductDetailsDTO getProductWithDetail(Long id);

    List<ProductListDTO> getAllProductWithInfo();

    List<ProductListDTO> getAllProductByCategory(String category);

    List<ProductListDTO> getAllProductByDiscount(Integer discount);
}
