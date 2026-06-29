package com.lulu.englishlearningapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_vocabulary_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "vocabulary_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVocabularyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vocabulary_id")
    private Vocabulary vocabulary;

    @Enumerated(EnumType.STRING)
    private VocabularyProgressStatus status;

    private int correctCount;

    private int wrongCount;

    private int reviewCount;

    private LocalDateTime lastReviewedAt;
}
