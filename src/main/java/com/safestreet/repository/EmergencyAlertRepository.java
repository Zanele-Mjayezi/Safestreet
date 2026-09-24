package com.safestreet.repository;

import com.safestreet.model.EmergencyAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
    List<EmergencyAlert> findByStatusOrderByCreatedAtDesc(EmergencyAlert.EmergencyStatus status);
    List<EmergencyAlert> findByUserIdOrderByCreatedAtDesc(Long userId);
}
