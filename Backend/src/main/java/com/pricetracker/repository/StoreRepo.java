package com.pricetracker.repository;

import com.pricetracker.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepo extends JpaRepository<Store, Long> {
    Optional<Store> findByName(String platform);

}