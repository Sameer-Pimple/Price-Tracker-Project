package com.pricetracker.service;

import com.pricetracker.entity.User;
import java.util.Optional;

public interface UserService {

    boolean registerUser(User user);

    void saveUser(User user);

    Optional<User> findById(Long id);
}
