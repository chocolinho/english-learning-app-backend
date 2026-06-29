package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.UpdateVocabularyProgressRequest;
import com.lulu.englishlearningapp.dto.VocabularyProgressResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.VocabularyProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabularies/progress")
@RequiredArgsConstructor
public class VocabularyProgressController {

    private final VocabularyProgressService vocabularyProgressService;

    @GetMapping
    public List<VocabularyProgressResponse> getMyProgress(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return vocabularyProgressService.getMyProgress(user);
    }

    @PutMapping("/{vocabularyId}")
    public VocabularyProgressResponse updateProgress(
            Authentication authentication,
            @PathVariable Long vocabularyId,
            @RequestBody UpdateVocabularyProgressRequest request) {

        User user = (User) authentication.getPrincipal();
        return vocabularyProgressService.updateProgress(user, vocabularyId, request);
    }
}
