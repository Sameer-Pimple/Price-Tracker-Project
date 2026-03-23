package com.pricetracker.repository;

import com.pricetracker.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    Optional<Product> findByPid(String pid);

    List<Product> findAllByCategoryContainingIgnoreCase(String category);

    @Query("""
    SELECT p FROM Product p
    WHERE p.updatedAt <= :time
    AND EXISTS (
        SELECT 1 FROM UserAlert ua
        WHERE ua.product = p
        AND ua.type = com.pricetracker.config.AlertType.ACTIVE
    )
""")
    List<Product> findOldProductsWithActiveAlerts(
            @Param("time") LocalDateTime time,
            Pageable pageable
    );

}
   