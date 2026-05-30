package com.pricetracker.controller;

import com.pricetracker.DTO.ProductDetailsDTO;
import com.pricetracker.DTO.ProductListDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService= productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProduct(){
        return ResponseEntity.ok(productService.getAllProduct());
    }

    @GetMapping("/All")
    public ResponseEntity<List<ProductListDTO>> getAllProductHome(){
        return ResponseEntity.ok(productService.getAllProductWithInfo());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getByID(@PathVariable Long id){
        return ResponseEntity.ok(productService.getProductById(id));
    }

    
    @GetMapping("Details/{pid}")
    public ResponseEntity<ProductDetailsDTO> getDetailsByPID(@PathVariable String pid) {
        return ResponseEntity.ok(productService.getProductWithDetail(pid));
    }
}

