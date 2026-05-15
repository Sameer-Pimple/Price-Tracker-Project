package com.pricetracker.service;

import com.pricetracker.DTO.UserAlertDTO;
import com.pricetracker.config.AlertType;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.User;
import com.pricetracker.entity.UserAlert;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.UserAlertRepo;
import com.pricetracker.repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


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
    public void createAlert(UserAlertDTO dto, UserDetails curruser) {

        User user = userRepo.findByEmail(curruser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findByPid(dto.getPid())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        boolean alreadyExists = alertRepo.existsByUserIdAndProductId(user.getId(),product.getId());

        if(alreadyExists){
            throw new RuntimeException("Alert already exists");
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
                alert.setUpdatedAt(LocalDateTime.now());
                alertRepo.save(alert);
            }
        }
    }


    @Override
    public List<UserAlert> getAlertsByUser(UserDetails curruser) {
        User user = userRepo.findByEmail(curruser.getUsername()).orElseThrow(() -> new RuntimeException("User Not Found"));
        return alertRepo.findByUserId(user.getId());
    }

}
