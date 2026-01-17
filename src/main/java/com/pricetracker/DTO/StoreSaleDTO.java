package com.pricetracker.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class StoreSaleDTO {

    private String sale_name;
    private Integer store_id;

    private String start_date;
    private String end_date;
}

