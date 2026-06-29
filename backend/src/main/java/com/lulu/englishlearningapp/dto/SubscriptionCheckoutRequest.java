package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.SubscriptionPlanType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionCheckoutRequest {

    @NotNull(message = "Plan type is required")
    private SubscriptionPlanType planType;
}
