package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.RegisterRequest;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.lulu.englishlearningapp.dto.LoginRequest;
import com.lulu.englishlearningapp.dto.AuthResponse;
import com.lulu.englishlearningapp.security.JwtService;
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder()
                .message("Login successful")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .token(token)
                .build();
    }
}