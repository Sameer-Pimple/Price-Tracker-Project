package com.pricetracker.service;

import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.config.AlertType;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.User;
import com.pricetracker.entity.UserAlert;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.UserAlertRepo;
import com.pricetracker.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserAlertServiceImpl implements UserAlertService {

    private final UserRepo userRepo;
    private final ProductRepo productRepo;
    private final UserAlertRepo alertRepo;

    public UserAlertServiceImpl(
            UserRepo userRepo,
            ProductRepo productRepo,
            UserAlertRepo alertRepo
    ) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.alertRepo = alertRepo;
    }

    @Override
    public void createAlert(UserAlertDTO dto) {

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        UserAlert alert = new UserAlert();
        alert.setUser(user);
        alert.setProduct(product);
        alert.setTargetPrice(dto.getTargetPrice());
        alert.setType(dto.getType());
        alertRepo.save(alert);
    }

    @Override
    public void checkAndTriggerAlerts(Long productId, Double currentPrice) {

        List<UserAlert> activeAlerts =
                alertRepo.findByProductIdAndType(
                        productId,
                        AlertType.ACTIVE
                );

        for (UserAlert alert : activeAlerts) {

            boolean shouldTrigger =
                    currentPrice <= alert.getTargetPrice();

            if (shouldTrigger) {
                alert.setType(AlertType.TRIGGERED);
                alertRepo.save(alert);
            }
        }
    }


    @Override
    public List<UserAlert> getAlertsByUser(Long userId) {

        if (!userRepo.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return alertRepo.findByUserId(userId);
    }

}
