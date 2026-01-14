package com.pricetracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "product",
        indexes = {
                @Index(name = "idx_product_asin", columnList = "asin")
        }
)

public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String asin;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String productUrl;


    @Column(nullable = false)
    private Integer currentPrice;

    @Column(nullable = false)
    private String category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // automatically set when record is created
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
