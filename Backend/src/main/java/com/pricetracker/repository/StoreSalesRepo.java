package com.pricetracker.repository;

import com.pricetracker.entity.Store;
import com.pricetracker.entity.StoreSales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Repository
public interface StoreSalesRepo extends JpaRepository<StoreSales, Long> {

    Optional<StoreSales> findByStoreAndStartDate(Optional<Store> store, LocalDateTime startDate);

    boolean existsBySaleNameAndStartDate(String saleName, LocalDateTime startDate);

}