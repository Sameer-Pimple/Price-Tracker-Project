package com.pricetracker.controller;

import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.entity.User;
import com.pricetracker.entity.UserAlert;
import com.pricetracker.service.UserAlertService;
import org.openqa.selenium.Alert;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    private final UserAlertService userAlertService;

    public AlertController(UserAlertService userAlertService){
        this.userAlertService = userAlertService;
    }

    @GetMapping
    public List<UserAlert> getAlerts(@AuthenticationPrincipal UserDetails user){
        return userAlertService.getAlertsByUser(user);
    }

    @PostMapping
    public ResponseEntity<Void> createAlert(@RequestBody UserAlertDTO dto, @AuthenticationPrincipal UserDetails user){
        userAlertService.createAlert(dto , user);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
