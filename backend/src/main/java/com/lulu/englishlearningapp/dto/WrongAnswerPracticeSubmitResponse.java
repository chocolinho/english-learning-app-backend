package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class WrongAnswerPracticeSubmitResponse {

    private boolean correct;

    private String correctAnswer;

    private WrongAnswerResponse wrongAnswer;

    private VocabularyProgressResponse progress;
}
