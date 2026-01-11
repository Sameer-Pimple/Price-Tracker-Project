package com.pricetracker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String username;
    private String email;
    private String mobileNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // One user can have multiple alerts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAlert> alerts;

    // Getters & Setters
}

