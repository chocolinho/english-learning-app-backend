package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SubscriptionCheckoutResponse {

    private String message;
    private PaymentResponse payment;
    private UserResponse user;
}
