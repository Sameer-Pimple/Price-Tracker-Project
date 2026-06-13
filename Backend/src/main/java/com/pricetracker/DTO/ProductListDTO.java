package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductListDTO implements Serializable {

    private String pid;
    private Long id;
    private Integer price;
    private Integer mrp;
    private Float rating;
    private String title;
    private Integer discount;
    private String imgurl;
    private String availability;
    private String store_imgurl;
}
