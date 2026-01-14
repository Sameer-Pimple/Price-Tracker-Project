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
@Table(name = "price_history")
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String asin;

    @Column(nullable = false)
    private Integer Price;

    private LocalDateTime checkedAt;

    // automatically set when history record is inserted
    @PrePersist
    protected void onCreate() {
        this.checkedAt = LocalDateTime.now();
    }
}
