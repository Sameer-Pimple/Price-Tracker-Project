package com.pricetracker.service;

import com.pricetracker.entity.User;

import java.util.Optional;


public interface UserService {

    void createUser(User user);

    void saveUser(User user);

    Optional<User> getUserById(Long id);

    User getUserByEmail(String Email);
}
