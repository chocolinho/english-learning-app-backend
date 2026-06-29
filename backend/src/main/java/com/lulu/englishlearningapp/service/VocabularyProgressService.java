package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.UpdateVocabularyProgressRequest;
import com.lulu.englishlearningapp.dto.VocabularyProgressResponse;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.entity.*;
import com.lulu.englishlearningapp.repository.UserVocabularyProgressRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VocabularyProgressService {

    private final UserVocabularyProgressRepository progressRepository;
    private final VocabularyRepository vocabularyRepository;

    public List<VocabularyProgressResponse> getMyProgress(User user) {
        return progressRepository.findByUserOrderByLastReviewedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VocabularyProgressResponse updateProgress(
            User user,
            Long vocabularyId,
            UpdateVocabularyProgressRequest request) {

        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));

        UserVocabularyProgress progress = getOrCreate(user, vocabulary);
        progress.setStatus(request.getStatus() == null
                ? VocabularyProgressStatus.LEARNING
                : request.getStatus());
        progress.setReviewCount(progress.getReviewCount() + 1);
        progress.setLastReviewedAt(LocalDateTime.now());

        return mapToResponse(progressRepository.save(progress));
    }

    public VocabularyProgressResponse recordLearning(User user, Vocabulary vocabulary) {
        UserVocabularyProgress progress = getOrCreate(user, vocabulary);

        if (progress.getStatus() == VocabularyProgressStatus.NEW) {
            progress.setStatus(VocabularyProgressStatus.LEARNING);
        }

        progress.setReviewCount(progress.getReviewCount() + 1);
        progress.setLastReviewedAt(LocalDateTime.now());

        return mapToResponse(progressRepository.save(progress));
    }

    public VocabularyProgressResponse recordAnswer(User user, Vocabulary vocabulary, boolean correct) {
        UserVocabularyProgress progress = getOrCreate(user, vocabulary);

        if (correct) {
            progress.setCorrectCount(progress.getCorrectCount() + 1);
        } else {
            progress.setWrongCount(progress.getWrongCount() + 1);
        }

        progress.setReviewCount(progress.getReviewCount() + 1);
        progress.setLastReviewedAt(LocalDateTime.now());

        if (progress.getCorrectCount() >= 3 && progress.getWrongCount() <= progress.getCorrectCount()) {
            progress.setStatus(VocabularyProgressStatus.MASTERED);
        } else {
            progress.setStatus(VocabularyProgressStatus.LEARNING);
        }

        return mapToResponse(progressRepository.save(progress));
    }

    private UserVocabularyProgress getOrCreate(User user, Vocabulary vocabulary) {
        return progressRepository.findByUserAndVocabulary(user, vocabulary)
                .orElseGet(() -> UserVocabularyProgress.builder()
                        .user(user)
                        .vocabulary(vocabulary)
                        .status(VocabularyProgressStatus.NEW)
                        .correctCount(0)
                        .wrongCount(0)
                        .reviewCount(0)
                        .build());
    }

    private VocabularyProgressResponse mapToResponse(UserVocabularyProgress progress) {
        Vocabulary vocabulary = progress.getVocabulary();

        return VocabularyProgressResponse.builder()
                .id(progress.getId())
                .vocabulary(VocabularyResponse.builder()
                        .id(vocabulary.getId())
                        .word(vocabulary.getWord())
                        .meaning(vocabulary.getMeaning())
                        .exampleSentence(vocabulary.getExampleSentence())
                        .topicId(vocabulary.getTopic().getId())
                        .topicName(vocabulary.getTopic().getName())
                        .build())
                .status(progress.getStatus())
                .correctCount(progress.getCorrectCount())
                .wrongCount(progress.getWrongCount())
                .reviewCount(progress.getReviewCount())
                .lastReviewedAt(progress.getLastReviewedAt())
                .build();
    }
}
