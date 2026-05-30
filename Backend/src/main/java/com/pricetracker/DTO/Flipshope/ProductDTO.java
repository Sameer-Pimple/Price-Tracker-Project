package com.pricetracker.DTO.Flipshope;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDTO {


    private String pid;
    private Integer sid;
    private Integer price;
    private String time;
    private String cat;
    private Integer mrp;
    private Float rating;
    private String title;
    private Integer discount;
    private String imgurl;
    private String availability;

    private List<GraphDataDTO> graph_data;

    private String store_name;
    private String store_domain;
    private String store_imgurl;


}
