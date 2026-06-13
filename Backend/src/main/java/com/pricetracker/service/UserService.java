package com.pricetracker.service;

import com.pricetracker.DTO.UserCreateRequest;
import com.pricetracker.entity.User;

import java.util.Optional;


public interface UserService {

    boolean createUser(UserCreateRequest userCreateRequest);

    void saveUser(User user);

    Optional<User> getUserById(Long id);

    Optional<User> getUserByEmail(String Email);

    boolean isEmailExist(String email);

    boolean updateUser(UserCreateRequest userReq);
}
