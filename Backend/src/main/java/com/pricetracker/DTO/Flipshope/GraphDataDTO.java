package com.pricetracker.DTO.Flipshope;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GraphDataDTO {

    private LocalDate time;
    private Integer min_price;

}

