package com.pricetracker.controller;

import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.DTO.UserAlertResponseDTO;
import com.pricetracker.entity.UserAlert;
import com.pricetracker.mapper.UserAlertResponseMapper;
import com.pricetracker.service.UserAlertService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    private final UserAlertService userAlertService;
    private final UserAlertResponseMapper mapper;

    public AlertController(UserAlertService userAlertService, UserAlertResponseMapper mapper){
        this.userAlertService = userAlertService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<UserAlertResponseDTO>> getAlerts(@AuthenticationPrincipal UserDetails user) {

        List<UserAlert> userAlert = userAlertService.getAlertsByUser(user);

        List<UserAlertResponseDTO> response = userAlert.stream()
                        .map(mapper::toEntity)
                        .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Void> createAlert(@RequestBody UserAlertDTO dto, @AuthenticationPrincipal UserDetails user){
        userAlertService.createAlert(dto , user);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
