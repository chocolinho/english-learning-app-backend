package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.VocabularyProgressStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class VocabularyProgressResponse {

    private Long id;

    private VocabularyResponse vocabulary;

    private VocabularyProgressStatus status;

    private int correctCount;

    private int wrongCount;

    private int reviewCount;

    private LocalDateTime lastReviewedAt;
}
