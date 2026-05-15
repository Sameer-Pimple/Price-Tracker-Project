package com.pricetracker.controller;

import com.pricetracker.DTO.UserCreateRequest;
import com.pricetracker.service.UserDetailsServiceImpl;
import com.pricetracker.service.UserService;
import com.pricetracker.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signin")
    public ResponseEntity<Map<String,String>> signup(@RequestBody UserCreateRequest userReq) {
        userService.createUser(userReq);
        String jwt = jwtUtil.generateToken(userReq.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody UserCreateRequest userReq) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userReq.getEmail(), userReq.getPassword()));
            String jwt = jwtUtil.generateToken(userReq.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Authentication failed", e);

            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }

}
