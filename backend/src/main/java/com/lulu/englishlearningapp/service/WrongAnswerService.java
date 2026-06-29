package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.dto.WrongAnswerPracticeSubmitRequest;
import com.lulu.englishlearningapp.dto.WrongAnswerPracticeSubmitResponse;
import com.lulu.englishlearningapp.dto.WrongAnswerResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.entity.WrongAnswer;
import com.lulu.englishlearningapp.repository.WrongAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WrongAnswerService {

    private final WrongAnswerRepository wrongAnswerRepository;
    private final VocabularyProgressService vocabularyProgressService;
    private final SubscriptionService subscriptionService;

    public void recordWrongAnswer(User user, Vocabulary vocabulary, String submittedAnswer) {
        WrongAnswer wrongAnswer = wrongAnswerRepository.findByUserAndVocabulary(user, vocabulary)
                .orElseGet(() -> WrongAnswer.builder()
                        .user(user)
                        .vocabulary(vocabulary)
                        .mistakeCount(0)
                        .build());

        wrongAnswer.setLastSubmittedAnswer(submittedAnswer);
        wrongAnswer.setMistakeCount(wrongAnswer.getMistakeCount() + 1);
        wrongAnswer.setLastMistakeAt(LocalDateTime.now());
        wrongAnswer.setResolved(false);

        wrongAnswerRepository.save(wrongAnswer);
    }

    public void markResolved(User user, Vocabulary vocabulary) {
        wrongAnswerRepository.findByUserAndVocabulary(user, vocabulary)
                .ifPresent(wrongAnswer -> {
                    wrongAnswer.setResolved(true);
                    wrongAnswerRepository.save(wrongAnswer);
                });
    }

    public List<WrongAnswerResponse> getMyWrongAnswers(User user) {
        return wrongAnswerRepository.findByUserAndResolvedFalseOrderByLastMistakeAtDesc(user)
                .stream()
                .filter(wrongAnswer -> subscriptionService.canAccessTopic(user, wrongAnswer.getVocabulary().getTopic()))
                .map(this::mapToResponse)
                .toList();
    }

    public List<WrongAnswerResponse> getPracticeItems(User user) {
        return getMyWrongAnswers(user);
    }

    public WrongAnswerPracticeSubmitResponse submitPracticeAnswer(
            User user,
            WrongAnswerPracticeSubmitRequest request) {

        WrongAnswer wrongAnswer = wrongAnswerRepository.findById(request.getWrongAnswerId())
                .orElseThrow(() -> new RuntimeException("Wrong answer not found"));

        if (!wrongAnswer.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Wrong answer does not belong to current user");
        }

        Vocabulary vocabulary = wrongAnswer.getVocabulary();
        subscriptionService.enforceTopicAccess(user, vocabulary.getTopic());

        String submittedAnswer = request.getAnswer() == null ? "" : request.getAnswer().trim();
        boolean correct = vocabulary.getMeaning().equalsIgnoreCase(submittedAnswer);

        if (correct) {
            wrongAnswer.setResolved(true);
        } else {
            wrongAnswer.setLastSubmittedAnswer(submittedAnswer);
            wrongAnswer.setMistakeCount(wrongAnswer.getMistakeCount() + 1);
            wrongAnswer.setLastMistakeAt(LocalDateTime.now());
            wrongAnswer.setResolved(false);
        }

        WrongAnswer savedWrongAnswer = wrongAnswerRepository.save(wrongAnswer);

        return WrongAnswerPracticeSubmitResponse.builder()
                .correct(correct)
                .correctAnswer(vocabulary.getMeaning())
                .wrongAnswer(mapToResponse(savedWrongAnswer))
                .progress(vocabularyProgressService.recordAnswer(user, vocabulary, correct))
                .build();
    }

    public void resolveWrongAnswer(Long id, User user) {
        WrongAnswer wrongAnswer = wrongAnswerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wrong answer not found"));

        if (!wrongAnswer.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Wrong answer does not belong to current user");
        }

        wrongAnswer.setResolved(true);
        wrongAnswerRepository.save(wrongAnswer);
    }

    private WrongAnswerResponse mapToResponse(WrongAnswer wrongAnswer) {
        Vocabulary vocabulary = wrongAnswer.getVocabulary();

        return WrongAnswerResponse.builder()
                .id(wrongAnswer.getId())
                .vocabulary(VocabularyResponse.builder()
                        .id(vocabulary.getId())
                        .word(vocabulary.getWord())
                        .meaning(vocabulary.getMeaning())
                        .exampleSentence(vocabulary.getExampleSentence())
                        .topicId(vocabulary.getTopic().getId())
                        .topicName(vocabulary.getTopic().getName())
                        .build())
                .lastSubmittedAnswer(wrongAnswer.getLastSubmittedAnswer())
                .mistakeCount(wrongAnswer.getMistakeCount())
                .lastMistakeAt(wrongAnswer.getLastMistakeAt())
                .resolved(wrongAnswer.isResolved())
                .build();
    }
}
