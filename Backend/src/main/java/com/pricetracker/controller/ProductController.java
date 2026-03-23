package com.pricetracker.controller;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.DTO.ProductDetailsDTO;
import com.pricetracker.DTO.ProductListDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.service.PriceHistoryService;
import com.pricetracker.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService= productService;
    }

    @GetMapping
    public List<Product> getAllProduct(){
        return productService.getAllProduct();
    }

    @GetMapping("/All")
    public List<ProductListDTO> getAllProductHome(){
        return productService.getAllProductWithInfo();
    }

    @GetMapping("/{id}")
    public Product getByID(@PathVariable Long id){
        return productService.getProductById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // @GetMapping("Details/{id}")
    // public ProductDetailsDTO getDetailsByID(@PathVariable Long id) {
    //     return productService.getProductWithDetail(id);
    // }
    
    @GetMapping("Details/{pid}")
    public ProductDetailsDTO getDetailsByPID(@PathVariable String pid) {
        return productService.getProductWithDetail(pid);
    }
}

