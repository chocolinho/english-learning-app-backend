package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthResponse {

    private String message;

    private Long userId;

    private String username;


    private String email;
    private String token;
}