package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.VocabularyRequest;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final SubscriptionService subscriptionService;

    public List<VocabularyResponse> getAllVocabularies(User user) {
        return vocabularyRepository.findAll()
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();
    }

    public VocabularyResponse getVocabularyById(Long id, User user) {
        Vocabulary vocabulary = findVocabularyById(id);
        subscriptionService.enforceTopicAccess(user, vocabulary.getTopic());
        return mapToResponse(vocabulary);
    }

    public VocabularyResponse createVocabulary(VocabularyRequest request, User user) {
        Topic topic = findTopicById(request.getTopicId());

        subscriptionService.enforceCanManageTopic(user, topic);
        subscriptionService.enforceCanCreateVocabulary(user);

        Vocabulary vocabulary = Vocabulary.builder()
                .word(request.getWord())
                .meaning(request.getMeaning())
                .exampleSentence(request.getExampleSentence())
                .topic(topic)
                .build();

        return mapToResponse(vocabularyRepository.save(vocabulary));
    }

    public VocabularyResponse updateVocabulary(Long id, VocabularyRequest request, User user) {
        Vocabulary existingVocabulary = findVocabularyById(id);
        Topic topic = findTopicById(request.getTopicId());

        subscriptionService.enforceCanManageTopic(user, existingVocabulary.getTopic());
        subscriptionService.enforceCanManageTopic(user, topic);

        existingVocabulary.setWord(request.getWord());
        existingVocabulary.setMeaning(request.getMeaning());
        existingVocabulary.setExampleSentence(request.getExampleSentence());
        existingVocabulary.setTopic(topic);

        return mapToResponse(vocabularyRepository.save(existingVocabulary));
    }

    public void deleteVocabulary(Long id, User user) {
        Vocabulary vocabulary = findVocabularyById(id);
        subscriptionService.enforceCanManageTopic(user, vocabulary.getTopic());
        vocabularyRepository.delete(vocabulary);
    }

    public List<VocabularyResponse> getVocabulariesByTopicId(Long topicId, User user) {
        Topic topic = findTopicById(topicId);
        subscriptionService.enforceTopicAccess(user, topic);

        return vocabularyRepository.findByTopicId(topicId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<VocabularyResponse> getQuizQuestionsByTopic(Long topicId, User user, Integer limit) {
        Topic topic = findTopicById(topicId);
        subscriptionService.enforceTopicAccess(user, topic);

        int questionLimit = resolveQuizQuestionLimit(user, limit);

        return vocabularyRepository.findByTopicId(topicId)
                .stream()
                .limit(questionLimit)
                .map(this::mapToResponse)
                .toList();
    }

    public List<VocabularyResponse> searchVocabulary(String keyword, User user) {
        return vocabularyRepository
                .findByWordContainingIgnoreCase(keyword)
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();
    }

    public Page<VocabularyResponse> getVocabulariesWithPagination(
            int page,
            int size,
            String sortField,
            User user) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortField));
        List<VocabularyResponse> accessibleVocabularies = vocabularyRepository.findAll(Sort.by(sortField))
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();

        return toPage(accessibleVocabularies, pageable);
    }

    public Page<VocabularyResponse> searchVocabularyWithPagination(
            String keyword,
            int page,
            int size,
            String sortField,
            User user) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortField));
        List<VocabularyResponse> accessibleVocabularies = vocabularyRepository
                .findByWordContainingIgnoreCaseOrMeaningContainingIgnoreCase(
                        keyword,
                        keyword,
                        pageable
                )
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();

        return new PageImpl<>(accessibleVocabularies, pageable, accessibleVocabularies.size());
    }

    private Vocabulary findVocabularyById(Long id) {
        return vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));
    }

    private Topic findTopicById(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    private int resolveQuizQuestionLimit(User user, Integer requestedLimit) {
        if (requestedLimit != null) {
            subscriptionService.enforceQuizQuestionLimit(user, requestedLimit);
            return requestedLimit;
        }

        if (subscriptionService.hasPremiumPrivileges(user)) {
            return Integer.MAX_VALUE;
        }

        return SubscriptionService.FREE_MAX_QUIZ_QUESTIONS;
    }

    private Page<VocabularyResponse> toPage(List<VocabularyResponse> vocabularies, Pageable pageable) {
        int start = (int) pageable.getOffset();

        if (start >= vocabularies.size()) {
            return new PageImpl<>(List.of(), pageable, vocabularies.size());
        }

        int end = Math.min(start + pageable.getPageSize(), vocabularies.size());
        return new PageImpl<>(vocabularies.subList(start, end), pageable, vocabularies.size());
    }

    private VocabularyResponse mapToResponse(Vocabulary vocabulary) {
        Topic topic = vocabulary.getTopic();

        return VocabularyResponse.builder()
                .id(vocabulary.getId())
                .word(vocabulary.getWord())
                .meaning(vocabulary.getMeaning())
                .exampleSentence(vocabulary.getExampleSentence())
                .topicId(topic == null ? null : topic.getId())
                .topicName(topic == null ? null : topic.getName())
                .build();
    }
}
