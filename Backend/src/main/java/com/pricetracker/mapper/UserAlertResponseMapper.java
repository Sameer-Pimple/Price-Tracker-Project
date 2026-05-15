package com.pricetracker.mapper;

import com.pricetracker.DTO.UserAlertResponseDTO;
import com.pricetracker.entity.UserAlert;
import org.springframework.stereotype.Component;

@Component
public class UserAlertResponseMapper {

    public UserAlertResponseDTO toEntity(UserAlert alert) {

        UserAlertResponseDTO dto = new UserAlertResponseDTO();

        dto.setTargetPrice(alert.getTargetPrice());

        dto.setType(alert.getType().name());

        dto.setProductTitle(alert.getProduct().getTitle());

        dto.setProductImage(alert.getProduct().getImg_url());

        return dto;
    }
}
