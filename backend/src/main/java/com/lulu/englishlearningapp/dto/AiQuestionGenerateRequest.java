package com.lulu.englishlearningapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiQuestionGenerateRequest {

    @NotNull(message = "Topic id is required")
    private Long topicId;

    @NotNull(message = "Question count is required")
    private Integer questionCount;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotBlank(message = "Question type is required")
    private String questionType;
}
