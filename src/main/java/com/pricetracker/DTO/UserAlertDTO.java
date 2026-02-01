package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pricetracker.config.AlertType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserAlertDTO {
    private Long userId;
    private Long productId;
    private Double targetPrice;
    private AlertType type;

}
