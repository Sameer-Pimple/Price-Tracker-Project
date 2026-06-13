package com.pricetracker.service;

import com.pricetracker.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final String OTP_PREFIX = "preload:otp:";
    private static final String REFRESH_TOKEN_PREFIX = "refresh:token:";

    public void sendVerificationOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        String redisKey = OTP_PREFIX + email;
        redisTemplate.opsForValue().set(redisKey, otp, 5, TimeUnit.MINUTES);
        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String userEnteredOtp) {
        String redisKey = OTP_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null || !storedOtp.equals(userEnteredOtp)) {
            return false;
        }
        redisTemplate.delete(redisKey);
        return true;
    }

    public void sendForgotOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        String redisKey = OTP_PREFIX + email;
        redisTemplate.opsForValue().set(redisKey, otp, 5, TimeUnit.MINUTES);
        emailService.sendForgotPasswordEmail(email, otp);
    }

    public Map<String, Object> refreshTokenWorkflow(HttpServletRequest request) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            refreshToken = Arrays.stream(request.getCookies())
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh Token Missing");
        }

        try {
            String username = jwtUtil.extractUsername(refreshToken);
            String incomingJti = jwtUtil.extractJti(refreshToken);

            // 1. Fetch valid JTI from Redis instead of RAM map
            String redisKey = REFRESH_TOKEN_PREFIX + username;
            String dynamicStoredJti = redisTemplate.opsForValue().get(redisKey);

            if (dynamicStoredJti == null || !dynamicStoredJti.equals(incomingJti)) {
                // Invalidate the compromised token in Redis
                redisTemplate.delete(redisKey);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Compromised token detected. Re-auth required.");
            }

            if (!jwtUtil.isTokenValid(refreshToken, username)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired Refresh Token");
            }

            String newAccessToken = jwtUtil.generateAccessToken(username);
            String newJti = UUID.randomUUID().toString();
            String newRefreshToken = jwtUtil.generateRefreshToken(username, newJti);

            // 2. Save the new JTI to Redis with the 7-day TTL limit
            redisTemplate.opsForValue().set(redisKey, newJti, jwtUtil.REFRESH_EXPIRY, TimeUnit.MILLISECONDS);

            ResponseCookie newCookie = jwtUtil.createRefreshTokenCookie(newRefreshToken, jwtUtil.REFRESH_EXPIRY);

            return Map.of(
                    "accessToken", newAccessToken,
                    "cookie", newCookie
            );

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token Chain", e);
        }
    }

    public void saveRefreshTokenToRedis(String username, String jti) {
        String redisKey = "refresh:token:" + username;
        redisTemplate.opsForValue().set(redisKey, jti, jwtUtil.REFRESH_EXPIRY, TimeUnit.MILLISECONDS);
    }
}