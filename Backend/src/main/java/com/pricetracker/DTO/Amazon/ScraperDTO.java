package com.pricetracker.DTO.Amazon;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ScraperDTO {
    private Integer Price;
    private Integer MRP;
    private Float Rating;
    private String availability;
    private Integer discount;
    private boolean success;
    private String message;
    private String productPid;

}
