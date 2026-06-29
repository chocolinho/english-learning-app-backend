package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.PaymentResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/my-history")
    public List<PaymentResponse> getMyPaymentHistory(Authentication authentication) {
        return paymentService.getMyPaymentHistory(getCurrentUser(authentication));
    }

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
