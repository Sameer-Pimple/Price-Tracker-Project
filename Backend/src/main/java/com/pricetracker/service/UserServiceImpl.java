package com.pricetracker.service;

import com.pricetracker.DTO.UserCreateRequest;
import com.pricetracker.entity.User;
import com.pricetracker.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UserServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder,AuthService authService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @Override
    public boolean createUser(UserCreateRequest userReq) {
        try{
            if(authService.verifyOtp(userReq.getEmail(),userReq.getOtp())){
                User user = new User();
                user.setUsername(userReq.getName());
                user.setEmail(userReq.getEmail());
                user.setMobileNumber(userReq.getMobilenum());
                user.setPassword(passwordEncoder.encode(userReq.getPassword()));
                userRepo.save(user);
                return true;
            }


        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return false;
    }

    @Override
    public boolean updateUser(UserCreateRequest userReq) {
        try{
            if(authService.verifyOtp(userReq.getEmail(),userReq.getOtp())){
                User user = userRepo.findByEmail(userReq.getEmail()).orElseThrow(() -> new RuntimeException("User Not Found"));
                user.setPassword(passwordEncoder.encode(userReq.getPassword()));
                userRepo.save(user);
                return true;
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return false;
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
    public Optional<User> getUserByEmail(String Email) {
        return userRepo.findByEmail(Email);
    }

    @Override
    public boolean isEmailExist(String email){
        return userRepo.existsByEmail(email);
    }


}
