package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.ChangePasswordRequest;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String changePassword(User user, ChangePasswordRequest request) {

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return "Password changed successfully";
    }
}