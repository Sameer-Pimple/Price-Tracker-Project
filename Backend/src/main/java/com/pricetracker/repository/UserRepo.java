package com.pricetracker.repository;

import com.pricetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
     Optional<User> findByEmail(String Email);
     Optional<User> findByUsername(String Username);
     boolean existsByEmail(String email);
}
