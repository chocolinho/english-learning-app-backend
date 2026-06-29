package com.lulu.englishlearningapp.controller;


import jakarta.validation.Valid;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.lulu.englishlearningapp.dto.VocabularyRequest;
import java.util.List;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
@RestController
@RequestMapping("/api/vocabularies")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping
    public List<VocabularyResponse> getAllVocabularies(Authentication authentication) {
        return vocabularyService.getAllVocabularies(getCurrentUser(authentication));
    }

    @GetMapping("/{id}")
    public VocabularyResponse getVocabularyById(
            @PathVariable Long id,
            Authentication authentication) {

        return vocabularyService.getVocabularyById(id, getCurrentUser(authentication));
    }
    @PostMapping
    public VocabularyResponse createVocabulary(
            @Valid @RequestBody VocabularyRequest request,
            Authentication authentication) {

        return vocabularyService.createVocabulary(request, getCurrentUser(authentication));
    }

    @PutMapping("/{id}")
    public VocabularyResponse updateVocabulary(
            @PathVariable Long id,
            @Valid @RequestBody VocabularyRequest request,
            Authentication authentication) {

        return vocabularyService.updateVocabulary(id, request, getCurrentUser(authentication));
    }

    @DeleteMapping("/{id}")
    public void deleteVocabulary(
            @PathVariable Long id,
            Authentication authentication) {

        vocabularyService.deleteVocabulary(id, getCurrentUser(authentication));
    }

    @GetMapping("/topic/{topicId}")
    public List<VocabularyResponse> getVocabulariesByTopicId(
            @PathVariable Long topicId,
            Authentication authentication) {

        return vocabularyService.getVocabulariesByTopicId(topicId, getCurrentUser(authentication));
    }
    @GetMapping("/page")
    public Page<VocabularyResponse> getVocabulariesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sort,
            Authentication authentication) {

        return vocabularyService.getVocabulariesWithPagination(page, size, sort, getCurrentUser(authentication));
    }
    @GetMapping("/search")
    public List<VocabularyResponse> searchVocabulary(
            @RequestParam String keyword,
            Authentication authentication) {

        return vocabularyService.searchVocabulary(keyword, getCurrentUser(authentication));
    }
    @GetMapping("/search-page")
    public Page<VocabularyResponse> searchVocabularyWithPagination(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sort,
            Authentication authentication) {

        return vocabularyService.searchVocabularyWithPagination(
                keyword,
                page,
                size,
                sort,
                getCurrentUser(authentication)
        );
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}


