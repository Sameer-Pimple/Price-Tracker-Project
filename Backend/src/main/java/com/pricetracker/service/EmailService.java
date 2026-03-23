package com.pricetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPriceAlert(String toEmail, String productUrl, double price) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🔥 Price Drop Alert!");
        message.setText(
                "Good news!\n\n" +
                        "Your tracked product price dropped.\n" +
                        "Current Price: ₹" + price + "\n" +
                        "Check here: " + productUrl
        );
        mailSender.send(message);
    }
}


