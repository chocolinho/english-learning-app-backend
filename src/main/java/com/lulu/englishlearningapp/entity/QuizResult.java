package com.lulu.englishlearningapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int totalQuestions;

    private int correctAnswers;

    private double score;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}