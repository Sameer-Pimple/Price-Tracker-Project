package com.pricetracker.service;

import com.pricetracker.entity.User;
import com.pricetracker.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;


    public UserServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public void createUser(User user) {
        userRepo.save(user);
    }

    @Override
    public void saveUser(User user) {
        userRepo.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    @Override
    public User getUserByEmail(String Email) {
        return userRepo.findByEmail(Email);
    }
}
