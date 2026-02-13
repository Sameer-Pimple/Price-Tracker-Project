//package com.pricetracker.service;
//
//import com.pricetracker.DTO.UserCreateRequest;
//import com.pricetracker.entity.User;
//import com.pricetracker.repository.UserRepo;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//
//@Service
//public class UserServiceImpl implements UserService {
//
//    private final UserRepo userRepo;
//    private final PasswordEncoder passwordEncoder;
//
//    public UserServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder) {
//        this.userRepo = userRepo;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public void createUser(UserCreateRequest userReq) {
//        User user = new User();
//        user.setUsername(userReq.getName());
//        user.setEmail(userReq.getEmail());
//        user.setMobileNumber(userReq.getMobilenum());
//        user.setPassword(passwordEncoder.encode(userReq.getPassword()));
//        userRepo.save(user);
//    }
//
//    @Override
//    public void saveUser(User user) {
//        userRepo.save(user);
//    }
//
//    @Override
//    public Optional<User> getUserById(Long id) {
//        return userRepo.findById(id);
//    }
//
//    @Override
//    public User getUserByEmail(String Email) {
//        return userRepo.findByEmail(Email);
//    }
//}
