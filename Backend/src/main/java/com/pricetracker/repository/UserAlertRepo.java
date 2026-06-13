package com.pricetracker.repository;

import com.pricetracker.config.AlertType;
import com.pricetracker.entity.UserAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAlertRepo extends JpaRepository<UserAlert, Long> {
    @Query("SELECT ua FROM UserAlert ua " +
            "JOIN FETCH ua.product " +
            "WHERE ua.user.id = :userId")
    List<UserAlert> findByUserId(Long userId);

    List<UserAlert> findByProductIdAndType(Long productId, AlertType type);

    boolean existsByUserIdAndProductId(Long Uid, Long Pid1);
}
