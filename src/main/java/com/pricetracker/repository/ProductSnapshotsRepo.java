package com.pricetracker.repository;

import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductSnapshotsRepo extends JpaRepository<ProductSnapshots, Long> {
    Optional<ProductSnapshots> findTopByProductOrderByScapedAtDesc(Product product);

    Optional<ProductSnapshots> findByProduct(Product product);
}
