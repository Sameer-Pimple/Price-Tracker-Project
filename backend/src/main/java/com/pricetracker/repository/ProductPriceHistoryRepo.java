package com.pricetracker.repository;

import com.pricetracker.entity.ProductPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPriceHistoryRepo extends JpaRepository<ProductPriceHistory, Long> {

}
