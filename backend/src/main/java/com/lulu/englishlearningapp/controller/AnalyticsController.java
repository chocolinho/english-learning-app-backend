package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.AdminAnalyticsResponse;
import com.lulu.englishlearningapp.dto.UserAnalyticsResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/api/analytics/me")
    public UserAnalyticsResponse getMyAnalytics(Authentication authentication) {
        return analyticsService.getUserAnalytics(getCurrentUser(authentication));
    }

    @GetMapping("/api/admin/analytics")
    public AdminAnalyticsResponse getAdminAnalytics() {
        return analyticsService.getAdminAnalytics();
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
