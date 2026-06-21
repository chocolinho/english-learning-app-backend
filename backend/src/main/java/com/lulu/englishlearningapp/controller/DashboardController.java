package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.DashboardResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return dashboardService.getDashboard(user);
    }
}