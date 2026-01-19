package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PagePropsDTO {


    @JsonProperty("getPData")
    private ProductDTO product;

    private StoreDTO storeforProducts;

    private List<GraphDataDTO> graph_Products_details;

    private List<StoreSaleDTO> storeSalesData;



}

