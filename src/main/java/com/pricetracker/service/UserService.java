package com.pricetracker.service;

import com.pricetracker.entity.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService {

    boolean registerUser(User user);

    void saveUser(User user);

    Optional<User> findById(Long id);
}
