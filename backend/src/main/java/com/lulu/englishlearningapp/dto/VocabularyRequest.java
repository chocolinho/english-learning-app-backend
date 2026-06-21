package com.lulu.englishlearningapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VocabularyRequest {

    @NotBlank(message = "Word is required")
    private String word;

    @NotBlank(message = "Meaning is required")
    private String meaning;

    private String exampleSentence;

    @NotNull(message = "Topic id is required")
    private Long topicId;
}