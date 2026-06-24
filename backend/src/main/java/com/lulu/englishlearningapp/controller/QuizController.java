package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.QuizSubmitRequest;
import com.lulu.englishlearningapp.dto.QuizSubmitResponse;
import com.lulu.englishlearningapp.entity.QuizResult;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import com.lulu.englishlearningapp.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    @PostMapping("/submit")
    public QuizSubmitResponse submitQuiz(
            @RequestBody QuizSubmitRequest request,
            Authentication authentication
    ) {
        if (authentication == null) {
            throw new RuntimeException("Authentication is null");
        }

        String email = authentication.getName();

        System.out.println("QUIZ AUTH EMAIL = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return quizService.submitQuiz(request, user);
    }

    @GetMapping("/results")
    public List<QuizResult> getQuizResults() {
        return quizService.getQuizResults();
    }

    @GetMapping("/my-results")
    public List<QuizResult> getMyQuizResults(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Authentication is null");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return quizService.getMyQuizResults(user);
    }
}