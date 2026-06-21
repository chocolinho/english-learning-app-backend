package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class QuizSubmitResponse {

    private int totalQuestions;

    private int correctAnswers;

    private double score;
}