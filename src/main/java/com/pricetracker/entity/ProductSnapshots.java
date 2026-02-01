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
@Table(name = "productSnapshots")
public class ProductSnapshots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", referencedColumnName = "id", nullable = false)
    private Store store;

    @Column(nullable = false)
    private Integer Price;

    @Column(nullable = false)
    private Integer MRP;

    @Column(nullable = false)
    private Double Rating;

    @Column(nullable = true)
    private String availability;

    @Column(nullable = true)
    private Integer discount;


    private LocalDateTime scapedAt;
    @PrePersist
    protected void onCreate() {
        this.scapedAt = LocalDateTime.now();
    }

}
