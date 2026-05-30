package com.pricetracker.service;


import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.entity.User;
import com.pricetracker.entity.UserAlert;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;

public interface UserAlertService {
    void createAlert(UserAlertDTO dto, UserDetails user);

   void checkAndTriggerAlerts(Long productId,Double currentPrice);

    List<UserAlert> getAlertsByUser(UserDetails user);


    void deleteAlert(Long AlertId);


    UserAlert updateAlert(Long id, Map<String, Object> updates);
}
