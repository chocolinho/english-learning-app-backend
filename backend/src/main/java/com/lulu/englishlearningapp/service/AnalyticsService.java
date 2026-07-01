package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AdminAnalyticsResponse;
import com.lulu.englishlearningapp.dto.AdminStatsResponse;
import com.lulu.englishlearningapp.dto.RecentQuizScoreResponse;
import com.lulu.englishlearningapp.dto.TopicProgressSummaryResponse;
import com.lulu.englishlearningapp.dto.UserAnalyticsResponse;
import com.lulu.englishlearningapp.entity.QuizResult;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.UserVocabularyProgress;
import com.lulu.englishlearningapp.entity.VocabularyProgressStatus;
import com.lulu.englishlearningapp.repository.FavoriteVocabularyRepository;
import com.lulu.englishlearningapp.repository.QuizResultRepository;
import com.lulu.englishlearningapp.repository.UserRepository;
import com.lulu.englishlearningapp.repository.UserVocabularyProgressRepository;
import com.lulu.englishlearningapp.repository.WrongAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final int RECENT_LIMIT = 8;

    private final QuizResultRepository quizResultRepository;
    private final FavoriteVocabularyRepository favoriteVocabularyRepository;
    private final WrongAnswerRepository wrongAnswerRepository;
    private final UserVocabularyProgressRepository vocabularyProgressRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final AdminService adminService;

    public UserAnalyticsResponse getUserAnalytics(User user) {
        List<QuizResult> quizResults = quizResultRepository.findByUserOrderBySubmittedAtDesc(user);
        List<UserVocabularyProgress> progressList = vocabularyProgressRepository.findByUserOrderByLastReviewedAtDesc(user);

        int totalXp = user.getXp() == null ? 0 : user.getXp();
        int totalCorrectAnswers = quizResults.stream()
                .mapToInt(QuizResult::getCorrectAnswers)
                .sum();
        int totalQuestions = quizResults.stream()
                .mapToInt(QuizResult::getTotalQuestions)
                .sum();
        int totalWrongAnswers = Math.max(totalQuestions - totalCorrectAnswers, 0);

        return UserAnalyticsResponse.builder()
                .totalXp(totalXp)
                .currentLevel(userService.calculateLevel(totalXp))
                .levelProgress(userService.calculateLevelProgress(totalXp))
                .dailyStreak(user.getDailyStreak() == null ? 0 : user.getDailyStreak())
                .totalQuizAttempts(quizResults.size())
                .averageScore(roundOneDecimal(averageScore(quizResults)))
                .bestScore(roundOneDecimal(bestScore(quizResults)))
                .totalCorrectAnswers(totalCorrectAnswers)
                .totalWrongAnswers(totalWrongAnswers)
                .favoriteVocabularyCount(favoriteVocabularyRepository.countByUser(user))
                .reviewedWrongAnswerCount(wrongAnswerRepository.countByUserAndResolvedTrue(user))
                .topicProgressSummary(buildTopicProgress(progressList))
                .recentQuizScores(buildRecentQuizScores(quizResults))
                .build();
    }

    public AdminAnalyticsResponse getAdminAnalytics() {
        AdminStatsResponse stats = adminService.getStats();
        List<QuizResult> quizResults = quizResultRepository.findAll();
        long totalUsers = stats.getTotalUsers();

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(countActiveUsers())
                .freeUsers(stats.getFreeUsers())
                .premiumUsers(stats.getPremiumUsers())
                .totalTopics(stats.getTotalTopics())
                .premiumTopics(stats.getPremiumTopics())
                .publicTopics(stats.getPublicTopics())
                .pendingTopics(stats.getPendingTopics())
                .totalVocabularies(stats.getTotalVocabularies())
                .quizAttempts(stats.getQuizAttempts())
                .averagePlatformScore(roundOneDecimal(averageScore(quizResults)))
                .premiumConversionRate(totalUsers == 0 ? 0 : (int) Math.round((stats.getPremiumUsers() * 100.0) / totalUsers))
                .recentPayments(stats.getRecentPayments())
                .topLearners(stats.getTopUsersByXp())
                .topTopics(stats.getTopTopicsByVocabularyCount())
                .build();
    }

    private List<TopicProgressSummaryResponse> buildTopicProgress(List<UserVocabularyProgress> progressList) {
        Map<Long, List<UserVocabularyProgress>> groupedByTopic = new LinkedHashMap<>();

        progressList.stream()
                .filter(progress -> progress.getVocabulary() != null && progress.getVocabulary().getTopic() != null)
                .forEach(progress -> {
                    Long topicId = progress.getVocabulary().getTopic().getId();
                    groupedByTopic.computeIfAbsent(topicId, key -> new java.util.ArrayList<>()).add(progress);
                });

        return groupedByTopic.values()
                .stream()
                .map(this::mapTopicProgress)
                .sorted(Comparator.comparing(TopicProgressSummaryResponse::getTopicName))
                .toList();
    }

    private TopicProgressSummaryResponse mapTopicProgress(List<UserVocabularyProgress> topicProgress) {
        Topic topic = topicProgress.get(0).getVocabulary().getTopic();
        int correctAnswers = topicProgress.stream().mapToInt(UserVocabularyProgress::getCorrectCount).sum();
        int wrongAnswers = topicProgress.stream().mapToInt(UserVocabularyProgress::getWrongCount).sum();
        int reviewCount = topicProgress.stream().mapToInt(UserVocabularyProgress::getReviewCount).sum();
        long masteredWords = topicProgress.stream()
                .filter(progress -> progress.getStatus() == VocabularyProgressStatus.MASTERED)
                .count();

        return TopicProgressSummaryResponse.builder()
                .topicId(topic.getId())
                .topicName(topic.getName())
                .reviewedWords(topicProgress.size())
                .masteredWords(masteredWords)
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .reviewCount(reviewCount)
                .accuracy(calculateAccuracy(correctAnswers, wrongAnswers))
                .build();
    }

    private List<RecentQuizScoreResponse> buildRecentQuizScores(List<QuizResult> quizResults) {
        return quizResults.stream()
                .limit(RECENT_LIMIT)
                .map(result -> RecentQuizScoreResponse.builder()
                        .id(result.getId())
                        .topicName(result.getTopic() == null ? "Mixed Practice" : result.getTopic().getName())
                        .totalQuestions(result.getTotalQuestions())
                        .correctAnswers(result.getCorrectAnswers())
                        .score(result.getScore())
                        .submittedAt(result.getSubmittedAt())
                        .build())
                .toList();
    }

    private long countActiveUsers() {
        LocalDate activeSince = LocalDate.now().minusDays(7);

        return userRepository.findAll()
                .stream()
                .filter(user -> user.getLastLearningDate() != null && !user.getLastLearningDate().isBefore(activeSince))
                .count();
    }

    private double averageScore(List<QuizResult> quizResults) {
        return quizResults.stream()
                .mapToDouble(QuizResult::getScore)
                .average()
                .orElse(0);
    }

    private double bestScore(List<QuizResult> quizResults) {
        return quizResults.stream()
                .mapToDouble(QuizResult::getScore)
                .max()
                .orElse(0);
    }

    private int calculateAccuracy(int correctAnswers, int wrongAnswers) {
        int total = correctAnswers + wrongAnswers;
        if (total == 0) {
            return 0;
        }

        return (int) Math.round((correctAnswers * 100.0) / total);
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
