package com.safestreet.dto;

import com.safestreet.model.Subscription;
import lombok.Data;

@Data
public class SubscriptionRequest {
    private Subscription.SubscriptionPlan planType;
    private String paymentMethod;
}
