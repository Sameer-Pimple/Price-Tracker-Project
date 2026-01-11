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
@Table(name = "product_history")
public class ProductPriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // many history rows belong to one product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( nullable = false)
    private Product product;

    @Column(nullable = false, length = 50)
    private String platformName;

    private Integer oldPrice;

    @Column(nullable = false)
    private Integer newPrice;

    private LocalDateTime recordedAt;

    // automatically set when history record is inserted
    @PrePersist
    protected void onCreate() {
        this.recordedAt = LocalDateTime.now();
    }
}
