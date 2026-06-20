package com.lulu.englishlearningapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vocabularies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String word;

    private String meaning;

    private String exampleSentence;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
}