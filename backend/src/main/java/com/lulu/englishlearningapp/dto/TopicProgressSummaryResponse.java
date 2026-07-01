package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TopicProgressSummaryResponse {

    private Long topicId;
    private String topicName;
    private long reviewedWords;
    private long masteredWords;
    private int correctAnswers;
    private int wrongAnswers;
    private int reviewCount;
    private int accuracy;
}
