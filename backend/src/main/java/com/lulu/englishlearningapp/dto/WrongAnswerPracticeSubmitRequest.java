package com.lulu.englishlearningapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WrongAnswerPracticeSubmitRequest {

    private Long wrongAnswerId;

    private String answer;
}
