package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.RankingUserResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/users")
    public List<RankingUserResponse> getUserRanking(
            @RequestParam(required = false) Integer limit,
            Authentication authentication) {

        return rankingService.getUserRanking(getCurrentUser(authentication), limit);
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
