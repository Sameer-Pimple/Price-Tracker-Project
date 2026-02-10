package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductListDTO {

    private String pid;
    private Integer price;
    private Integer mrp;
    private Double rating;
    private String title;
    private Integer discount;
    private String imgurl;
    private String availability;
    private String store_imgurl;
}
