package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserAlertResponseDTO {

    // Alert info
    private Double targetPrice;
    private String type;

    // Product info
    private String productTitle;
    private String productImage;

}
