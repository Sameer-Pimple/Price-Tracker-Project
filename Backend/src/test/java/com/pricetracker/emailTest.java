package com.pricetracker;

import com.pricetracker.entity.Product;
import com.pricetracker.repository.UserRepo;
import com.pricetracker.service.EmailService;
import com.pricetracker.service.ProductService;
import com.pricetracker.service.UserAlertService;
import com.pricetracker.service.UserService;
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

    @Autowired
    public UserRepo userRepo;

    @Test
    void mailsend(){
        System.out.println(userRepo.findByEmail("demo@gmail.com"));
    }

}
