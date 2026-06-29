package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.TopicRequest;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public List<TopicResponse> getAllTopics(Authentication authentication) {
        return topicService.getAllTopics(getCurrentUser(authentication));
    }

    @PostMapping
    public TopicResponse createTopic(
            @Valid @RequestBody TopicRequest request,
            Authentication authentication) {

        return topicService.createTopic(request, getCurrentUser(authentication));
    }

    @GetMapping("/{id}")
    public TopicResponse getTopicById(
            @PathVariable Long id,
            Authentication authentication) {

        return topicService.getTopicById(id, getCurrentUser(authentication));
    }

    @PutMapping("/{id}")
    public TopicResponse updateTopic(
            @PathVariable Long id,
            @Valid @RequestBody TopicRequest request,
            Authentication authentication) {

        return topicService.updateTopic(id, request, getCurrentUser(authentication));
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(
            @PathVariable Long id,
            Authentication authentication) {

        topicService.deleteTopic(id, getCurrentUser(authentication));
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
