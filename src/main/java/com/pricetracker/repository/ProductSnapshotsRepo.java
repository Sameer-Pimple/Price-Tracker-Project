package com.pricetracker.repository;

import com.pricetracker.entity.ProductSnapshots;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductSnapshotsRepo extends JpaRepository<ProductSnapshots, Long> {
}
