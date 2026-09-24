package com.safestreet.controller;

import com.safestreet.dto.SubscriptionRequest;
import com.safestreet.model.Subscription;
import com.safestreet.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubscriptionController {
    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<Subscription> create(@RequestBody SubscriptionRequest request, Authentication auth) {
        return ResponseEntity.ok(subscriptionService.createSubscription(request, auth.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Subscription>> getMy(Authentication auth) {
        return ResponseEntity.ok(subscriptionService.getMySubscriptions(auth.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Subscription>> getAll() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }
}
