package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;

    private Integer xp;
    private int level;
    private int currentLevelXp;
    private int nextLevelXp;
    private int levelProgress;

    private int dailyStreak;
}
