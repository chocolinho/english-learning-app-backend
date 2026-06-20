package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.QuizSubmitRequest;
import com.lulu.englishlearningapp.dto.QuizSubmitResponse;
import com.lulu.englishlearningapp.entity.QuizResult;
import com.lulu.englishlearningapp.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.Authentication;
import com.lulu.englishlearningapp.entity.User;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/submit")
    public QuizSubmitResponse submitQuiz(
            @RequestBody QuizSubmitRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return quizService.submitQuiz(request, user);
    }
    @GetMapping("/results")
    public List<QuizResult> getQuizResults() {
        return quizService.getQuizResults();
    }
    @GetMapping("/my-results")
    public List<QuizResult> getMyResults(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return quizService.getMyQuizResults(user);
    }
}