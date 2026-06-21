package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class VocabularyResponse {

    private Long id;

    private String word;

    private String meaning;

    private String exampleSentence;

    private Long topicId;

    private String topicName;
}