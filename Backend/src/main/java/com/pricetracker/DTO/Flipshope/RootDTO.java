package com.pricetracker.DTO.Flipshope;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RootDTO implements Serializable {

    private PagePropsDTO pageProps;
    private  String rating;
    private String availability;
    private String discount;
}


