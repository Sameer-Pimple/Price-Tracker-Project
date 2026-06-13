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

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🔒 Your PriceTracker Verification Code");
        message.setText(
                "Welcome to PriceTracker!\n\n" +
                        "Your verification code is: " + otp + "\n\n" +
                        "This code is valid for 5 minutes. Do not share this code with anyone."
        );
        mailSender.send(message);
    }

    public void sendForgotPasswordEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🔒 Reset Your PriceTracker Password");
        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset the password for your PriceTracker account.\n\n" +
                        "Your password reset verification code is: " + otp + "\n\n" +
                        "This code is valid for 5 minutes. If you did not request this, please ignore this email securely.\n\n" +
                        "Do not share this code with anyone for your account's security."
        );
        mailSender.send(message);
    }
}


