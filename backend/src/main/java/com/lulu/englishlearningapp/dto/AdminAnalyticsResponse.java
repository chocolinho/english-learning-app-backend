package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AdminAnalyticsResponse {

    private long totalUsers;
    private long activeUsers;
    private long freeUsers;
    private long premiumUsers;

    private long totalTopics;
    private long premiumTopics;
    private long publicTopics;
    private long pendingTopics;
    private long totalVocabularies;
    private long quizAttempts;

    private double averagePlatformScore;
    private int premiumConversionRate;

    private List<PaymentResponse> recentPayments;
    private List<AdminTopUserResponse> topLearners;
    private List<AdminTopTopicResponse> topTopics;
}
