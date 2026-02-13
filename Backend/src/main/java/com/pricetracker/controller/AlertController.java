//package com.pricetracker.controller;
//
//import com.pricetracker.entity.UserAlert;
//import com.pricetracker.service.UserAlertService;
//import org.openqa.selenium.Alert;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/alerts")
//public class AlertController {
//    private final UserAlertService userAlertService;
//
//    public AlertController(UserAlertService userAlertService){
//        this.userAlertService = userAlertService;
//    }
//
//    @GetMapping
//    public List<UserAlert> getAlerts(@RequestParam Long userId){
//        return userAlertService.getAlertsByUser(userId);
//    }
//
//    @PostMapping
//    public ResponseEntity<Void> createAlert(@RequestBody Alert alert){
//        userAlertService.createAlert(alert);
//    }
//
//
//}
