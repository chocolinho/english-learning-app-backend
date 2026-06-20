package com.lulu.englishlearningapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizAnswerRequest {

    private Long vocabularyId;

    private String answer;
}