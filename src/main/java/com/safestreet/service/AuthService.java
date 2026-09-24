package com.safestreet.service;

import com.safestreet.dto.AuthResponse;
import com.safestreet.dto.LoginRequest;
import com.safestreet.dto.RegisterRequest;
import com.safestreet.model.User;
import com.safestreet.repository.UserRepository;
import com.safestreet.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication);
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        return buildAuthResponse(user, jwt);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(User.Role.RESIDENT)
                .subscriptionPlan(User.SubscriptionPlan.STANDARD_PROTECTION)
                .subscriptionActive(false)
                .build();
        userRepository.save(user);
        String jwt = jwtUtil.generateTokenFromUsername(user.getUsername());
        return buildAuthResponse(user, jwt);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .subscriptionPlan(user.getSubscriptionPlan() != null ? user.getSubscriptionPlan().name() : null)
                .subscriptionActive(user.getSubscriptionActive())
                .build();
    }
}
