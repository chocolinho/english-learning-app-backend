package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AdminStatsResponse;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.TopicAccessType;
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
        long totalUsers = userRepository.count();
        long premiumUsers = userRepository.countBySubscriptionType(SubscriptionType.PREMIUM);
        long totalTopics = topicRepository.count();
        long premiumTopics = topicRepository.countByAccessType(TopicAccessType.PREMIUM);

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .freeUsers(totalUsers - premiumUsers)
                .premiumUsers(premiumUsers)
                .totalTopics(totalTopics)
                .freeTopics(totalTopics - premiumTopics)
                .premiumTopics(premiumTopics)
                .totalVocabularies(vocabularyRepository.count())
                .totalQuizAttempts(quizResultRepository.count())
                .build();
    }
}
