package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AdminStatsResponse;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.QuizResultRepository;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.UserRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final QuizResultRepository quizResultRepository;
    private final SubscriptionService subscriptionService;

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

    public List<TopicResponse> getTopics(User admin) {
        return topicRepository.findAll()
                .stream()
                .map(topic -> mapTopicToResponse(topic, admin))
                .toList();
    }

    public TopicResponse updateTopicAccessType(Long topicId, TopicAccessType accessType, User admin) {
        Topic topic = findTopicById(topicId);
        topic.setAccessType(accessType);
        return mapTopicToResponse(topicRepository.save(topic), admin);
    }

    public TopicResponse approveTopic(Long topicId, User admin) {
        Topic topic = findTopicById(topicId);
        topic.setApprovalStatus(TopicApprovalStatus.APPROVED);
        return mapTopicToResponse(topicRepository.save(topic), admin);
    }

    public TopicResponse rejectTopic(Long topicId, User admin) {
        Topic topic = findTopicById(topicId);
        topic.setApprovalStatus(TopicApprovalStatus.REJECTED);
        return mapTopicToResponse(topicRepository.save(topic), admin);
    }

    private Topic findTopicById(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    private TopicResponse mapTopicToResponse(Topic topic, User admin) {
        User owner = topic.getOwner();

        return TopicResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .vocabularyCount(vocabularyRepository.countByTopicId(topic.getId()))
                .ownerId(owner == null ? null : owner.getId())
                .ownerUsername(owner == null ? null : owner.getUsername())
                .visibility(subscriptionService.getTopicVisibility(topic))
                .accessType(subscriptionService.getTopicAccessType(topic))
                .approvalStatus(subscriptionService.getTopicApprovalStatus(topic))
                .locked(!subscriptionService.canAccessTopic(admin, topic))
                .ownedByCurrentUser(subscriptionService.isTopicOwner(admin, topic))
                .build();
    }
}
