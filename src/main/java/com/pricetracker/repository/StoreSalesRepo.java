package com.pricetracker.repository;

import com.pricetracker.entity.StoreSales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreSalesRepo extends JpaRepository<StoreSales, Long> {
}
