package com.pricetracker.controller;

import com.pricetracker.service.AuthService;
import com.pricetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/sendEmail")
public class EmailController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;

    @PostMapping("/verify")
    public ResponseEntity<?> SendOTP(@RequestBody Map<String,String> req){
        System.out.println(userService.isEmailExist(req.get("email")));
        if(!userService.isEmailExist(req.get("email"))){
            authService.sendVerificationOtp(req.get("email"));
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return ResponseEntity.status(409).body("Email Exist");
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> SendForgotOTP(@RequestBody Map<String,String> req){
        System.out.println(userService.isEmailExist(req.get("email")));
        if(userService.isEmailExist(req.get("email"))){
            authService.sendForgotOtp(req.get("email"));
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return ResponseEntity.status(409).body("Account Not Exist");
    }
}
