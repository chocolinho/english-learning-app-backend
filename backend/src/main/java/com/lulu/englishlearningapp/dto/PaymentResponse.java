package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.PaymentStatus;
import com.lulu.englishlearningapp.entity.SubscriptionPlanType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class PaymentResponse {

    private Long id;
    private SubscriptionPlanType planType;
    private BigDecimal amount;
    private PaymentStatus status;
    private String provider;
    private String providerTransactionId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
