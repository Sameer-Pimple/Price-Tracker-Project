package com.pricetracker;

import com.pricetracker.entity.Product;
import com.pricetracker.service.EmailService;
import com.pricetracker.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class emailTest {

    @Autowired
    public EmailService emailService;

    @Autowired
    public ProductService productService;

    @Test
    void mailsend(){
        List<Product> p = productService.getProductForDailyUpdate();
        System.out.println(p);
    }

}
