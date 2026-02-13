package com.pricetracker.DTO.Amazon;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ScraperDTO {
    private Integer Price;
    private Integer MRP;
    private Float Rating;
    private String availability;
    private Integer discount;
}
