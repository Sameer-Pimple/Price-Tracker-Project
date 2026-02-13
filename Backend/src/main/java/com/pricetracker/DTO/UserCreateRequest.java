package com.pricetracker.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {
    private String name;
    private String email;
    private Long mobilenum;
    private String password;
}

