package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AiQuestionGenerateResponse {

    private Long topicId;
    private String topicName;
    private int questionCount;
    private List<AiGeneratedQuestionResponse> questions;
}
