package com.safestreet.service;

import com.safestreet.dto.EmergencyRequest;
import com.safestreet.model.EmergencyAlert;
import com.safestreet.model.User;
import com.safestreet.repository.EmergencyAlertRepository;
import com.safestreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {
    @Autowired
    private EmergencyAlertRepository emergencyAlertRepository;
    @Autowired
    private UserRepository userRepository;

    public EmergencyAlert triggerEmergency(EmergencyRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        EmergencyAlert alert = EmergencyAlert.builder()
                .user(user)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .location(request.getLocation())
                .status(EmergencyAlert.EmergencyStatus.ACTIVE)
                .build();
        return emergencyAlertRepository.save(alert);
    }

    public List<EmergencyAlert> getActiveEmergencies() {
        return emergencyAlertRepository.findByStatusOrderByCreatedAtDesc(EmergencyAlert.EmergencyStatus.ACTIVE);
    }

    public List<EmergencyAlert> getMyEmergencies(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return emergencyAlertRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public EmergencyAlert resolveEmergency(Long id) {
    EmergencyAlert alert = emergencyAlertRepository.findById(id).orElseThrow();
    alert.setStatus(EmergencyAlert.EmergencyStatus.RESOLVED);
    alert.setResolvedAt(java.time.LocalDateTime.now());
    return emergencyAlertRepository.save(alert);
}
}
