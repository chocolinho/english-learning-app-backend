package com.lulu.englishlearningapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitResponse {

    private int totalQuestions;
    private int correctAnswers;
    private double score;

    private int earnedXp;
    private int totalXp;
}