package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminStatsResponse {

    private long totalUsers;

    private long freeUsers;

    private long premiumUsers;

    private long totalTopics;

    private long freeTopics;

    private long premiumTopics;

    private long totalVocabularies;

    private long totalQuizAttempts;
}
