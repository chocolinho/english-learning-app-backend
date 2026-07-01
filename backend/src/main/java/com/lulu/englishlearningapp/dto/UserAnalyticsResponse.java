package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class UserAnalyticsResponse {

    private int totalXp;
    private int currentLevel;
    private int levelProgress;
    private int dailyStreak;

    private long totalQuizAttempts;
    private double averageScore;
    private double bestScore;
    private int totalCorrectAnswers;
    private int totalWrongAnswers;

    private long favoriteVocabularyCount;
    private long reviewedWrongAnswerCount;

    private List<TopicProgressSummaryResponse> topicProgressSummary;
    private List<RecentQuizScoreResponse> recentQuizScores;
}
