package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.RankingUserResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 50;

    private final UserRepository userRepository;
    private final UserService userService;
    private final SubscriptionService subscriptionService;

    public List<RankingUserResponse> getUserRanking(User currentUser, Integer requestedLimit) {
        int limit = resolveLimit(requestedLimit);
        List<User> users = userRepository.findByOrderByXpDesc(PageRequest.of(0, limit));
        List<RankingUserResponse> ranking = new ArrayList<>();

        for (int index = 0; index < users.size(); index++) {
            User user = users.get(index);
            int totalXp = user.getXp() == null ? 0 : user.getXp();

            ranking.add(RankingUserResponse.builder()
                    .rank(index + 1)
                    .userId(user.getId())
                    .username(resolveDisplayName(user))
                    .xp(totalXp)
                    .level(userService.calculateLevel(totalXp))
                    .dailyStreak(user.getDailyStreak() == null ? 0 : user.getDailyStreak())
                    .subscriptionType(subscriptionService.getSubscriptionType(user))
                    .currentUser(currentUser != null && user.getId() != null && user.getId().equals(currentUser.getId()))
                    .build());
        }

        return ranking;
    }

    private int resolveLimit(Integer requestedLimit) {
        if (requestedLimit == null || requestedLimit <= 0) {
            return DEFAULT_LIMIT;
        }

        return Math.min(requestedLimit, MAX_LIMIT);
    }

    private String resolveDisplayName(User user) {
        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername();
        }

        return user.getEmail();
    }
}
