package com.pricetracker.controller;

import com.pricetracker.DTO.Flipshope.TrackRequestDTO;
import com.pricetracker.DTO.SuccessScrapDTO;
import com.pricetracker.service.PriceTrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/track")
public class PriceTrackController {

    private final PriceTrackingService trackingService;

    public PriceTrackController(PriceTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping
    public ResponseEntity<SuccessScrapDTO> track(
            @RequestBody TrackRequestDTO dto) {

        return trackingService.trackByAmazonUrl(dto.getUrl());

    }
}


