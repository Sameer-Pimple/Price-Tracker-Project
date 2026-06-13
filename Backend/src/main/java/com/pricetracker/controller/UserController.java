package com.pricetracker.controller;

import com.pricetracker.DTO.UserCreateRequest;
import com.pricetracker.service.AuthService;
import com.pricetracker.service.UserService;
import com.pricetracker.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody UserCreateRequest userReq) {
        if (userService.createUser(userReq)) {
            String email = userReq.getEmail();
            String accessToken = jwtUtil.generateAccessToken(email);
            String jti = UUID.randomUUID().toString();
            String refreshToken = jwtUtil.generateRefreshToken(email, jti);

            authService.saveRefreshTokenToRedis(email,jti);
            ResponseCookie cookie = jwtUtil.createRefreshTokenCookie(refreshToken, jwtUtil.REFRESH_EXPIRY);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of(
                            "AccessToken", accessToken,
                            "tokenType", "Bearer"
                    ));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Invalid or expired OTP. Please try again."));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserCreateRequest userReq) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userReq.getEmail(), userReq.getPassword()));

            String email = userReq.getEmail();
            String accessToken = jwtUtil.generateAccessToken(email);
            String jti = UUID.randomUUID().toString();
            String refreshToken = jwtUtil.generateRefreshToken(email, jti);

            authService.saveRefreshTokenToRedis(email,jti);
            ResponseCookie cookie = jwtUtil.createRefreshTokenCookie(refreshToken, jwtUtil.REFRESH_EXPIRY);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of(
                            "AccessToken", accessToken,
                            "tokenType", "Bearer"
                    ));

        } catch (Exception e) {
            log.error("Authentication failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid Username or Password"));
        }
    }

    @PatchMapping("/update")
    public ResponseEntity<Map<String, String>> update(@RequestBody UserCreateRequest userReq) {
        if (userService.updateUser(userReq)) {
            return ResponseEntity.status(201).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Invalid or expired OTP. Please try again."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        try {
            Map<String, Object> tokenData = authService.refreshTokenWorkflow(request);
            ResponseCookie newCookie = (ResponseCookie) tokenData.get("cookie");
            String newAccessToken = (String) tokenData.get("accessToken");

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                    .body(Map.of("AccessToken", newAccessToken));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }
}