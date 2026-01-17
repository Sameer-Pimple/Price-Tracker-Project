package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PagePropsDTO {


    private ProductDTO getPData;

    private List<GraphDataDTO> graph_Products_details;

    private List<StoreSaleDTO> storeSalesData;

    private String fspid;


}

