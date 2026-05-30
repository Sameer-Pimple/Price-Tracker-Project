package com.pricetracker.controller;

import com.pricetracker.DTO.ProductListDTO;
import com.pricetracker.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/trends")
public class TrendsController {

    private final ProductService productService;

    public TrendsController(ProductService productService){
        this.productService =productService;
    }

    @GetMapping
    public List<ProductListDTO> getProductByDiscount(@RequestParam Integer discount){
        return productService.getAllProductByDiscount(discount);
    }
}
