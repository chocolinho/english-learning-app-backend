package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.SubscriptionCheckoutRequest;
import com.lulu.englishlearningapp.dto.SubscriptionCheckoutResponse;
import com.lulu.englishlearningapp.dto.UserResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.PaymentService;
import com.lulu.englishlearningapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final PaymentService paymentService;
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getMySubscription(Authentication authentication) {
        return userService.getCurrentUserResponse(getCurrentUser(authentication));
    }

    @PostMapping("/checkout")
    public SubscriptionCheckoutResponse checkout(
            @Valid @RequestBody SubscriptionCheckoutRequest request,
            Authentication authentication) {

        return paymentService.checkoutPremium(
                getCurrentUser(authentication),
                request.getPlanType()
        );
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
