package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.TopicAccessType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminTopicAccessRequest {

    @NotNull(message = "Topic access type is required")
    private TopicAccessType accessType;
}
