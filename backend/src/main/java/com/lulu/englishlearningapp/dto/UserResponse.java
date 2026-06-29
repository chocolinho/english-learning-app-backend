package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.Role;
import com.lulu.englishlearningapp.entity.SubscriptionStatus;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private SubscriptionType subscriptionType;
    private SubscriptionStatus subscriptionStatus;
    private LocalDate premiumUntil;
    private boolean premium;

    private Integer xp;
    private int level;
    private int currentLevelXp;
    private int nextLevelXp;
    private int levelProgress;

    private int dailyStreak;
}
