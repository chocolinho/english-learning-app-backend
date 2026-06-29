package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.VocabularyProgressStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVocabularyProgressRequest {

    private VocabularyProgressStatus status;
}
