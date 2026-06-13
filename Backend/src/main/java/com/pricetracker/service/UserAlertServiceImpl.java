package com.pricetracker.service;

import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.Exceptions.AppException;
import com.pricetracker.config.AlertType;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.User;
import com.pricetracker.entity.UserAlert;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.UserAlertRepo;
import com.pricetracker.repository.UserRepo;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class UserAlertServiceImpl implements UserAlertService {

    private final UserRepo userRepo;
    private final ProductRepo productRepo;
    private final UserAlertRepo alertRepo;

    public UserAlertServiceImpl(UserRepo userRepo, ProductRepo productRepo, UserAlertRepo alertRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.alertRepo = alertRepo;
    }

    @Override
    // 1. Evict when a new alert is created
    @CacheEvict(value = "userAlerts", key = "#curruser.username")
    public void createAlert(UserAlertDTO dto, UserDetails curruser) {
        User user = userRepo.findByEmail(curruser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findByPid(dto.getPid())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        boolean alreadyExists = alertRepo.existsByUserIdAndProductId(user.getId(), product.getId());

        if (alreadyExists) {
            throw new AppException("Alert Already Exist", HttpStatus.CONFLICT);
        }
        UserAlert alert = new UserAlert();
        alert.setUser(user);
        alert.setProduct(product);
        alert.setTargetPrice(dto.getTargetPrice());
        alert.setType(AlertType.ACTIVE);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setUpdatedAt(LocalDateTime.now());
        alertRepo.save(alert);
    }

    @Override
    // 2. Evict when the background checker triggers alerts.
    // Since multiple users could have an alert triggered for this productId,
    // it's safest to clear all entries in the "userAlerts" cache space entirely.
    @CacheEvict(value = "userAlerts", allEntries = true)
    public void checkAndTriggerAlerts(Long productId, Double currentPrice) {
        List<UserAlert> activeAlerts = alertRepo.findByProductIdAndType(productId, AlertType.ACTIVE);

        for (UserAlert alert : activeAlerts) {
            boolean shouldTrigger = currentPrice <= alert.getTargetPrice();
            if (shouldTrigger) {
                alert.setType(AlertType.TRIGGERED);
                alert.setUpdatedAt(LocalDateTime.now());
                alertRepo.save(alert);
            }
        }
    }

    @Override
    @Cacheable(value = "userAlerts", key = "#curruser.username")
    public List<UserAlert> getAlertsByUser(UserDetails curruser) {
        User user = userRepo.findByEmail(curruser.getUsername())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        return alertRepo.findByUserId(user.getId());
    }

    @Override
    // 3. Evict when an alert is deleted.
    // We change the return type to String (returning the user's email) so @CacheEvict can find the correct key.
    @CacheEvict(value = "userAlerts", key = "#result")
    public String deleteAlert(Long alertId) {
        UserAlert alert = alertRepo.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        String userEmail = alert.getUser().getEmail(); // Adjust to getEmail() or getUsername() depending on your User entity
        alertRepo.delete(alert);

        return userEmail;
    }

    @Override
    // 4. Evict when an alert target price is updated
    @CacheEvict(value = "userAlerts", key = "#result.user.email")
    public UserAlert updateAlert(Long id, Map<String, Object> updates) {
        UserAlert alert = alertRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        if (updates.containsKey("targetPrice")) {
            Double targetPrice = Double.valueOf(updates.get("targetPrice").toString());
            alert.setTargetPrice(targetPrice);
        }
        alertRepo.save(alert);
        return alert;
    }
}