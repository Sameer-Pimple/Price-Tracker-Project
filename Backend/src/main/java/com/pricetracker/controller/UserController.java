//package com.pricetracker.controller;
//
//import com.pricetracker.DTO.UserCreateRequest;
//import com.pricetracker.entity.User;
//import com.pricetracker.service.UserService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/user")
//public class UserController {
//
//    private final UserService userService;
//
//    public UserController(UserService userService){
//        this.userService = userService;
//    }
//
//    @PostMapping("/createUser")
//    public ResponseEntity<String> createUser(@RequestBody UserCreateRequest userReq){
//        userService.createUser(userReq);
//        return ResponseEntity.status(HttpStatus.CREATED).body("User Created Successfully");
//    }
//
//
//}
