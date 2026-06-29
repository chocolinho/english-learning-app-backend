package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.TopicVisibility;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicRequest {

    @NotBlank(message = "Topic name is required")
    private String name;

    private String description;

    private TopicVisibility visibility;

    private TopicAccessType accessType;

    private TopicApprovalStatus approvalStatus;
}
