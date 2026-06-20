package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.UserResponse;
import com.lulu.englishlearningapp.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}