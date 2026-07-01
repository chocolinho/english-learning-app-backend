package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.SubscriptionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RankingUserResponse {

    private int rank;
    private Long userId;
    private String username;
    private int xp;
    private int level;
    private int dailyStreak;
    private SubscriptionType subscriptionType;
    private boolean currentUser;
}
