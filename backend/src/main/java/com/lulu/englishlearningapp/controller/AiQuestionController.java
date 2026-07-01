package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.AiQuestionGenerateRequest;
import com.lulu.englishlearningapp.dto.AiQuestionGenerateResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.AiQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/questions")
@RequiredArgsConstructor
public class AiQuestionController {

    private final AiQuestionService aiQuestionService;

    @PostMapping("/generate")
    public AiQuestionGenerateResponse generateQuestions(
            @Valid @RequestBody AiQuestionGenerateRequest request,
            Authentication authentication) {

        return aiQuestionService.generateQuestions(getCurrentUser(authentication), request);
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
