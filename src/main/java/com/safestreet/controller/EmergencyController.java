package com.safestreet.controller;

import com.safestreet.dto.EmergencyRequest;
import com.safestreet.model.EmergencyAlert;
import com.safestreet.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emergency")
@CrossOrigin(origins = "http://localhost:5173")
public class EmergencyController {
    @Autowired
    private EmergencyService emergencyService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/trigger")
    public ResponseEntity<EmergencyAlert> trigger(@RequestBody EmergencyRequest request, Authentication auth) {
        EmergencyAlert alert = emergencyService.triggerEmergency(request, auth.getName());
        messagingTemplate.convertAndSend("/topic/emergencies", alert);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GUARD')")
    public ResponseEntity<List<EmergencyAlert>> getActive() {
        return ResponseEntity.ok(emergencyService.getActiveEmergencies());
    }

    @GetMapping("/my")
    public ResponseEntity<List<EmergencyAlert>> getMy(Authentication auth) {
        return ResponseEntity.ok(emergencyService.getMyEmergencies(auth.getName()));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GUARD')")
    public ResponseEntity<EmergencyAlert> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.resolveEmergency(id));
    }
}
