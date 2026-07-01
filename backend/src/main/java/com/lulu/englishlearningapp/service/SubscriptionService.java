package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.entity.Role;
import com.lulu.englishlearningapp.entity.SubscriptionStatus;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.TopicVisibility;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.exception.FeatureLockedException;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    public static final int FREE_MAX_CUSTOM_TOPICS = 3;
    public static final int FREE_MAX_CUSTOM_VOCABULARIES = 30;
    public static final int FREE_MAX_QUIZ_QUESTIONS = 5;

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;

    public SubscriptionType getSubscriptionType(User user) {
        return user.getSubscriptionType() == null
                ? SubscriptionType.FREE
                : user.getSubscriptionType();
    }

    public SubscriptionStatus getSubscriptionStatus(User user) {
        return user.getSubscriptionStatus() == null
                ? SubscriptionStatus.ACTIVE
                : user.getSubscriptionStatus();
    }

    public boolean isPremium(User user) {
        if (user == null) {
            return false;
        }

        if (getSubscriptionType(user) != SubscriptionType.PREMIUM) {
            return false;
        }

        if (getSubscriptionStatus(user) != SubscriptionStatus.ACTIVE) {
            return false;
        }

        LocalDate premiumUntil = user.getPremiumUntil();
        return premiumUntil == null || !premiumUntil.isBefore(LocalDate.now());
    }

    public boolean hasPremiumPrivileges(User user) {
        return isAdmin(user) || isPremium(user);
    }

    public boolean canExportVocabulary(User user) {
        return hasPremiumPrivileges(user);
    }

    public void enforceCanExportVocabulary(User user) {
        if (!canExportVocabulary(user)) {
            throw new FeatureLockedException("Vocabulary export requires Premium.");
        }
    }

    public void enforceCanCreateTopic(User user) {
        if (hasPremiumPrivileges(user)) {
            return;
        }

        long customTopicCount = topicRepository.countByOwnerId(user.getId());

        if (customTopicCount >= FREE_MAX_CUSTOM_TOPICS) {
            throw new FeatureLockedException(
                    "Free plan can create up to " + FREE_MAX_CUSTOM_TOPICS + " custom topics."
            );
        }
    }

    public void enforceCanCreateVocabulary(User user) {
        if (hasPremiumPrivileges(user)) {
            return;
        }

        long customVocabularyCount = vocabularyRepository.countByTopicOwnerId(user.getId());

        if (customVocabularyCount >= FREE_MAX_CUSTOM_VOCABULARIES) {
            throw new FeatureLockedException(
                    "Free plan can create up to " + FREE_MAX_CUSTOM_VOCABULARIES + " custom vocabularies."
            );
        }
    }

    public void enforceQuizQuestionLimit(User user, int questionCount) {
        if (hasPremiumPrivileges(user)) {
            return;
        }

        if (questionCount > FREE_MAX_QUIZ_QUESTIONS) {
            throw new FeatureLockedException(
                    "Free plan quizzes are limited to " + FREE_MAX_QUIZ_QUESTIONS + " questions."
            );
        }
    }

    public boolean canViewTopicInLibrary(User user, Topic topic) {
        if (canManageTopic(user, topic)) {
            return true;
        }

        return getTopicVisibility(topic) == TopicVisibility.PUBLIC
                && getTopicApprovalStatus(topic) == TopicApprovalStatus.APPROVED;
    }

    public boolean canAccessTopic(User user, Topic topic) {
        if (canManageTopic(user, topic)) {
            return true;
        }

        if (getTopicVisibility(topic) != TopicVisibility.PUBLIC
                || getTopicApprovalStatus(topic) != TopicApprovalStatus.APPROVED) {
            return false;
        }

        if (getTopicAccessType(topic) == TopicAccessType.FREE) {
            return true;
        }

        return isPremium(user);
    }

    public void enforceTopicAccess(User user, Topic topic) {
        if (!canAccessTopic(user, topic)) {
            throw new FeatureLockedException("This topic requires Premium access.");
        }
    }

    public boolean canManageTopic(User user, Topic topic) {
        return isAdmin(user) || isTopicOwner(user, topic);
    }

    public void enforceCanManageTopic(User user, Topic topic) {
        if (!canManageTopic(user, topic)) {
            throw new FeatureLockedException("You can only manage your own topics.");
        }
    }

    public boolean isTopicOwner(User user, Topic topic) {
        if (user == null || topic == null || topic.getOwner() == null) {
            return false;
        }

        return topic.getOwner().getId() != null
                && topic.getOwner().getId().equals(user.getId());
    }

    public boolean isAdmin(User user) {
        return user != null && user.getRole() == Role.ADMIN;
    }

    public TopicVisibility getTopicVisibility(Topic topic) {
        return topic.getVisibility() == null
                ? TopicVisibility.PUBLIC
                : topic.getVisibility();
    }

    public TopicAccessType getTopicAccessType(Topic topic) {
        return topic.getAccessType() == null
                ? TopicAccessType.FREE
                : topic.getAccessType();
    }

    public TopicApprovalStatus getTopicApprovalStatus(Topic topic) {
        return topic.getApprovalStatus() == null
                ? TopicApprovalStatus.APPROVED
                : topic.getApprovalStatus();
    }
}
