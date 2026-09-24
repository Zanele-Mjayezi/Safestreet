package com.safestreet.repository;

import com.safestreet.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Subscription> findByStatus(Subscription.SubscriptionStatus status);
}
