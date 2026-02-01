package com.pricetracker.service;


import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.entity.UserAlert;

import java.util.List;

public interface UserAlertService {
    void createAlert(UserAlertDTO dto);

   void checkAndTriggerAlerts(Long productId,Double currentPrice);

    List<UserAlert> getAlertsByUser(Long userId);
}
