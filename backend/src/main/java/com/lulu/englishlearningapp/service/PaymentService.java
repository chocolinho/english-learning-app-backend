package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.PaymentResponse;
import com.lulu.englishlearningapp.dto.SubscriptionCheckoutResponse;
import com.lulu.englishlearningapp.entity.PaymentStatus;
import com.lulu.englishlearningapp.entity.PaymentTransaction;
import com.lulu.englishlearningapp.entity.SubscriptionPlanType;
import com.lulu.englishlearningapp.entity.SubscriptionStatus;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.PaymentTransactionRepository;
import com.lulu.englishlearningapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final String MOCK_PROVIDER = "MOCK";

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public SubscriptionCheckoutResponse checkoutPremium(User user, SubscriptionPlanType planType) {
        LocalDateTime now = LocalDateTime.now();
        PaymentTransaction paymentTransaction = PaymentTransaction.builder()
                .user(user)
                .planType(planType)
                .amount(resolveAmount(planType))
                .status(PaymentStatus.SUCCESS)
                .provider(MOCK_PROVIDER)
                .providerTransactionId("MOCK-" + UUID.randomUUID())
                .createdAt(now)
                .paidAt(now)
                .build();

        PaymentTransaction savedPayment = paymentTransactionRepository.save(paymentTransaction);

        user.setSubscriptionType(SubscriptionType.PREMIUM);
        user.setSubscriptionStatus(SubscriptionStatus.ACTIVE);
        user.setPremiumUntil(resolvePremiumUntil(user.getPremiumUntil(), planType));
        User savedUser = userRepository.save(user);

        return SubscriptionCheckoutResponse.builder()
                .message("Premium subscription activated")
                .payment(mapToResponse(savedPayment))
                .user(userService.getCurrentUserResponse(savedUser))
                .build();
    }

    public List<PaymentResponse> getMyPaymentHistory(User user) {
        return paymentTransactionRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LocalDate resolvePremiumUntil(LocalDate currentPremiumUntil, SubscriptionPlanType planType) {
        LocalDate startDate = currentPremiumUntil != null && currentPremiumUntil.isAfter(LocalDate.now())
                ? currentPremiumUntil
                : LocalDate.now();

        if (planType == SubscriptionPlanType.YEARLY) {
            return startDate.plusYears(1);
        }

        return startDate.plusMonths(1);
    }

    private BigDecimal resolveAmount(SubscriptionPlanType planType) {
        if (planType == SubscriptionPlanType.YEARLY) {
            return BigDecimal.valueOf(99);
        }

        return BigDecimal.valueOf(9);
    }

    private PaymentResponse mapToResponse(PaymentTransaction paymentTransaction) {
        return PaymentResponse.builder()
                .id(paymentTransaction.getId())
                .planType(paymentTransaction.getPlanType())
                .amount(paymentTransaction.getAmount())
                .status(paymentTransaction.getStatus())
                .provider(paymentTransaction.getProvider())
                .providerTransactionId(paymentTransaction.getProviderTransactionId())
                .createdAt(paymentTransaction.getCreatedAt())
                .paidAt(paymentTransaction.getPaidAt())
                .build();
    }
}
