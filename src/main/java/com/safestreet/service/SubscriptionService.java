package com.safestreet.service;

import com.safestreet.dto.SubscriptionRequest;
import com.safestreet.model.Subscription;
import com.safestreet.model.User;
import com.safestreet.repository.SubscriptionRepository;
import com.safestreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserRepository userRepository;

    private double getPlanPrice(Subscription.SubscriptionPlan plan) {
        return switch (plan) {
            case STANDARD_PROTECTION -> 14.99;
            case ADVANCED_GUARD -> 29.99;
            case PREMIUM_SHIELD -> 49.99;
        };
    }

    public Subscription createSubscription(SubscriptionRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setSubscriptionPlan(User.SubscriptionPlan.valueOf(request.getPlanType().name()));
        user.setSubscriptionActive(true);
        userRepository.save(user);

        Subscription sub = Subscription.builder()
                .user(user)
                .planType(request.getPlanType())
                .amount(getPlanPrice(request.getPlanType()))
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .paymentMethod(request.getPaymentMethod())
                .build();
        return subscriptionRepository.save(sub);
    }

    public List<Subscription> getMySubscriptions(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return subscriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }
}
