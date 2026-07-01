package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AiGeneratedQuestionResponse {

    private String question;
    private List<String> options;
    private String correctAnswer;
    private String explanation;
    private Long vocabularyId;
    private String word;
    private String difficulty;
    private String questionType;
}
