package com.pricetracker.repository;

import com.pricetracker.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    Optional<Product> findByPid(String pid);

}
