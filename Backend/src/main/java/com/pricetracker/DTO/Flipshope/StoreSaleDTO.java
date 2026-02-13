package com.pricetracker.DTO.Flipshope;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class StoreSaleDTO {
    @JsonProperty("store_id")
    private Long storeId;
    private String sale_name;
    private LocalDateTime start_date;
    private LocalDateTime end_date;
}

