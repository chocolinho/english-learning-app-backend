package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AiGeneratedQuestionResponse;
import com.lulu.englishlearningapp.dto.AiQuestionGenerateRequest;
import com.lulu.englishlearningapp.dto.AiQuestionGenerateResponse;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AiQuestionService {

    private static final Set<Integer> ALLOWED_QUESTION_COUNTS = Set.of(5, 10, 20, 30);
    private static final Set<String> ALLOWED_DIFFICULTIES = Set.of("EASY", "MEDIUM", "HARD");
    private static final String MULTIPLE_CHOICE = "MULTIPLE_CHOICE";
    private static final int MIN_OPTION_COUNT = 4;

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final SubscriptionService subscriptionService;

    public AiQuestionGenerateResponse generateQuestions(User user, AiQuestionGenerateRequest request) {
        subscriptionService.enforceCanUseAiFeature(user);
        validateRequest(request);

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        subscriptionService.enforceTopicAccess(user, topic);

        List<Vocabulary> vocabularies = vocabularyRepository.findByTopicId(topic.getId())
                .stream()
                .filter(this::hasUsableWordAndMeaning)
                .sorted(Comparator.comparing(Vocabulary::getId))
                .toList();

        if (vocabularies.size() < MIN_OPTION_COUNT) {
            throw new RuntimeException("AI question generation requires at least 4 vocabulary words in this topic.");
        }

        int actualQuestionCount = Math.min(request.getQuestionCount(), vocabularies.size());
        List<AiGeneratedQuestionResponse> questions = vocabularies.stream()
                .limit(actualQuestionCount)
                .map(vocabulary -> buildQuestion(vocabulary, vocabularies, request))
                .toList();

        return AiQuestionGenerateResponse.builder()
                .topicId(topic.getId())
                .topicName(topic.getName())
                .questionCount(questions.size())
                .questions(questions)
                .build();
    }

    private void validateRequest(AiQuestionGenerateRequest request) {
        if (!ALLOWED_QUESTION_COUNTS.contains(request.getQuestionCount())) {
            throw new RuntimeException("Question count must be one of 5, 10, 20, or 30.");
        }

        if (!ALLOWED_DIFFICULTIES.contains(normalize(request.getDifficulty()))) {
            throw new RuntimeException("Difficulty must be EASY, MEDIUM, or HARD.");
        }

        if (!MULTIPLE_CHOICE.equals(normalize(request.getQuestionType()))) {
            throw new RuntimeException("Only MULTIPLE_CHOICE questions are supported.");
        }
    }

    private AiGeneratedQuestionResponse buildQuestion(
            Vocabulary vocabulary,
            List<Vocabulary> topicVocabularies,
            AiQuestionGenerateRequest request) {

        List<String> options = buildOptions(vocabulary, topicVocabularies);
        String word = vocabulary.getWord().trim();
        String meaning = vocabulary.getMeaning().trim();
        String explanation = buildExplanation(vocabulary);

        return AiGeneratedQuestionResponse.builder()
                .question("What does '" + word + "' mean?")
                .options(options)
                .correctAnswer(meaning)
                .explanation(explanation)
                .vocabularyId(vocabulary.getId())
                .word(word)
                .difficulty(normalize(request.getDifficulty()))
                .questionType(normalize(request.getQuestionType()))
                .build();
    }

    private List<String> buildOptions(Vocabulary correctVocabulary, List<Vocabulary> topicVocabularies) {
        LinkedHashSet<String> options = new LinkedHashSet<>();
        options.add(correctVocabulary.getMeaning().trim());

        topicVocabularies.stream()
                .filter(vocabulary -> !vocabulary.getId().equals(correctVocabulary.getId()))
                .map(Vocabulary::getMeaning)
                .filter(meaning -> meaning != null && !meaning.isBlank())
                .map(String::trim)
                .filter(meaning -> !meaning.equalsIgnoreCase(correctVocabulary.getMeaning().trim()))
                .limit(MIN_OPTION_COUNT - 1L)
                .forEach(options::add);

        if (options.size() < MIN_OPTION_COUNT) {
            throw new RuntimeException("This topic needs at least 4 unique vocabulary meanings.");
        }

        List<String> shuffledOptions = new ArrayList<>(options);
        Collections.shuffle(shuffledOptions, new Random(correctVocabulary.getId()));
        return shuffledOptions;
    }

    private String buildExplanation(Vocabulary vocabulary) {
        String word = vocabulary.getWord().trim();
        String meaning = vocabulary.getMeaning().trim();

        if (vocabulary.getExampleSentence() != null && !vocabulary.getExampleSentence().isBlank()) {
            return word + " means " + meaning + ". Example: " + vocabulary.getExampleSentence().trim();
        }

        return word + " means " + meaning + ".";
    }

    private boolean hasUsableWordAndMeaning(Vocabulary vocabulary) {
        return vocabulary.getWord() != null
                && !vocabulary.getWord().isBlank()
                && vocabulary.getMeaning() != null
                && !vocabulary.getMeaning().isBlank();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }
}
