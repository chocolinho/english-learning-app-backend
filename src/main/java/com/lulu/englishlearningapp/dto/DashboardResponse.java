package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardResponse {

    private long totalTopics;

    private long totalVocabularies;

    private long totalQuizzes;

    private double averageScore;

    private double bestScore;
}