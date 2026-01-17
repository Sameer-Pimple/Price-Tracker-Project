package com.pricetracker.DTO;

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
    private Integer stock;
    private String time;
    private String cat;
    private String imgurl;
    private Integer mrp;
    private Integer rating;
    private String title;

    private List<String> all_imgurls;

    private List<GraphDataDTO> graph_data;

    private String store_name;
    private String store_imgurl;


}

