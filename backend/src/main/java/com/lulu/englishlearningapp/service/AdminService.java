package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AdminStatsResponse;
import com.lulu.englishlearningapp.repository.QuizResultRepository;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.UserRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final QuizResultRepository quizResultRepository;

    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalTopics(topicRepository.count())
                .totalVocabularies(vocabularyRepository.count())
                .totalQuizAttempts(quizResultRepository.count())
                .build();
    }
}
