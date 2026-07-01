package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RecentQuizScoreResponse {

    private Long id;
    private String topicName;
    private int totalQuestions;
    private int correctAnswers;
    private double score;
    private LocalDateTime submittedAt;
}
