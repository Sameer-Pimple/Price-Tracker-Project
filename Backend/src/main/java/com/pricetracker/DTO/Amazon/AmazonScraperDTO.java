package com.pricetracker.DTO.Amazon;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AmazonScraperDTO implements Serializable {
    private Integer Price;
    private Integer MRP;
    private Float Rating;
    private String availability;
    private Integer discount;


}
