package com.pricetracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "platform_price")
public class PlatformPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // many platform prices belong to one product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Product product;

    @Column(nullable = false, length = 50)
    private String platformName;

    @Column(length = 1000)
    private String productUrl;

    @Column(nullable = false)
    private Integer currentPrice;

    private LocalDateTime lastCheckedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastCheckedAt = LocalDateTime.now();
    }
}
