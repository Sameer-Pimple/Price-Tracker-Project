package com.pricetracker.repository;

import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceHistoryRepo extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByProductAndStoreOrderByDateAsc(Product product, Store store);

    Optional<PriceHistory> findTopByProductAndStoreOrderByDateDesc(Product product, Store store);

    boolean existsByProductAndDate(Product product, LocalDate now);
}