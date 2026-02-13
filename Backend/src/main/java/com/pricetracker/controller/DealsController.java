package com.pricetracker.controller;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.DTO.ProductListDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deals")
public class DealsController {
    private final ProductService productService;

    public DealsController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public List<ProductListDTO> getProductByCategory(@RequestParam String category){
        return productService.getAllProductByCategory(category);
    }

}
