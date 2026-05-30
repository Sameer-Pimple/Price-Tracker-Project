package com.pricetracker.repository;

import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductSnapshotsRepo extends JpaRepository<ProductSnapshots, Long> {
    Optional<ProductSnapshots> findTopByProductOrderByScapedAtDesc(Product product);

    Optional<ProductSnapshots> findByProduct(Product product);

    List<ProductSnapshots> findByDiscountGreaterThanEqual(Integer discount);

    @Query(value = "SELECT ps.* FROM product_snapshots ps " +
            "INNER JOIN (SELECT DISTINCT ua.product_id FROM user_alerts ua) active_alerts " +
            "ON ps.product_id = active_alerts.product_id " +
            "WHERE ps.scaped_at <= :dueTime " +
            "ORDER BY ps.scaped_at ASC " +
            "LIMIT :batchSize " +
            "FOR UPDATE SKIP LOCKED", nativeQuery = true)
    List<ProductSnapshots> findDueSnapshots(@Param("dueTime") LocalDateTime dueTime, @Param("batchSize") int batchSize);
}
