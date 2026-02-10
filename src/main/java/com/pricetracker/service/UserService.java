package com.pricetracker.service;

import com.pricetracker.DTO.UserCreateRequest;
import com.pricetracker.entity.User;

import java.util.Optional;


public interface UserService {

    void createUser(UserCreateRequest userCreateRequest);

    void saveUser(User user);

    Optional<User> getUserById(Long id);

    User getUserByEmail(String Email);
}
