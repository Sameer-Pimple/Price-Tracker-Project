package com.pricetracker.DTO.Flipshope;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class StoreDTO implements Serializable {
    private Long store_id;
    private String img_url;
    private String store_name;
    private String store_domain;

    // Standard Constructor
    public StoreDTO(Long store_id, String img_url, String store_name, String store_domain) {
        this.store_id = store_id;
        this.img_url = img_url;
        this.store_name = store_name;
        this.store_domain = store_domain;
    }

    public static StoreDTO defaultStore() {
        return new StoreDTO(
                2L,
                "https://cdn.hyyzo.com/images/file1636461644055amazonlogo.png",
                "amazon",
                "amazon.in"
        );
    }

}
