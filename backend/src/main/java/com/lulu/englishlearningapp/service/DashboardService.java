package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.DashboardResponse;
import com.lulu.englishlearningapp.entity.QuizResult;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.QuizResultRepository;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final QuizResultRepository quizResultRepository;

    public DashboardResponse getDashboard(User user) {

        List<QuizResult> results =
                quizResultRepository.findByUserId(user.getId());

        double averageScore = results.stream()
                .mapToDouble(QuizResult::getScore)
                .average()
                .orElse(0);

        double bestScore = results.stream()
                .mapToDouble(QuizResult::getScore)
                .max()
                .orElse(0);

        return DashboardResponse.builder()
                .totalTopics(topicRepository.count())
                .totalVocabularies(vocabularyRepository.count())
                .totalQuizzes(results.size())
                .averageScore(averageScore)
                .bestScore(bestScore)
                .build();
    }
}