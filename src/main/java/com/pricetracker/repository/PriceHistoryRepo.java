package com.pricetracker.repository;

import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceHistoryRepo extends JpaRepository<PriceHistory, Long> {

    Optional<PriceHistory> findTopByProductAndStoreOrderByDateDesc(Product product, Store store);
}
