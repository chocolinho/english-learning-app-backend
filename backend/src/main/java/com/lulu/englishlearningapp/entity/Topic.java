package com.lulu.englishlearningapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TopicVisibility visibility = TopicVisibility.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TopicAccessType accessType = TopicAccessType.FREE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TopicApprovalStatus approvalStatus = TopicApprovalStatus.APPROVED;
}
