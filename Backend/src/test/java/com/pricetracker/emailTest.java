package com.pricetracker;

import com.pricetracker.entity.Product;
import com.pricetracker.repository.ProductRepo;
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

    @Autowired
    public ProductRepo repo;

    @Test
    void mailsend(){
//        emailService.sendPriceAlert("sameerpimple2002@gmail.com","https://www.amazon.in/Philips-SereneShine-Glare-Free-Illumination-Efficient/dp/B0GL8V1NSW/?_encoding=UTF8&pd_rd_w=QFE8O&content-id=amzn1.sym.163c611d-45af-44a2-803f-ecf4de66c803%3Aamzn1.symc.b1464ab7-6d6a-4fc8-be8f-f2e9bcc64228&pf_rd_p=163c611d-45af-44a2-803f-ecf4de66c803&pf_rd_r=MTA8YHG817PCNTPKH7HC&pd_rd_wg=EqBZt&pd_rd_r=c66ebdf7-baf8-4067-8f8b-4992b1625f23&ref_=pd_hp_d_btf_ci_mcx_mr_ca_id_hp_d&th=1",55);
    }

}
