package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.AdminStatsResponse;
import com.lulu.englishlearningapp.dto.AdminTopicAccessRequest;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminService.getStats();
    }

    @GetMapping("/topics")
    public List<TopicResponse> getTopics(Authentication authentication) {
        return adminService.getTopics(getCurrentUser(authentication));
    }

    @PatchMapping("/topics/{id}/access-type")
    public TopicResponse updateTopicAccessType(
            @PathVariable Long id,
            @Valid @RequestBody AdminTopicAccessRequest request,
            Authentication authentication) {

        return adminService.updateTopicAccessType(
                id,
                request.getAccessType(),
                getCurrentUser(authentication)
        );
    }

    @PatchMapping("/topics/{id}/approve")
    public TopicResponse approveTopic(
            @PathVariable Long id,
            Authentication authentication) {

        return adminService.approveTopic(id, getCurrentUser(authentication));
    }

    @PatchMapping("/topics/{id}/reject")
    public TopicResponse rejectTopic(
            @PathVariable Long id,
            Authentication authentication) {

        return adminService.rejectTopic(id, getCurrentUser(authentication));
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
