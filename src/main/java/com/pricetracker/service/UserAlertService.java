package com.pricetracker.service;

import com.pricetracker.entity.User;
import com.pricetracker.entity.UserAlert;
import org.springframework.stereotype.Service;

@Service
public interface UserAlertService {
    UserAlert getOrCreateAlert(User user, UserAlert userAlert);
}
