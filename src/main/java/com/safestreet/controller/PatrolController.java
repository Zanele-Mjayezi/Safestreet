package com.safestreet.controller;

import com.safestreet.dto.PatrolUpdateRequest;
import com.safestreet.model.Patrol;
import com.safestreet.service.PatrolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patrols")
@CrossOrigin(origins = "http://localhost:5173")
public class PatrolController {
    @Autowired
    private PatrolService patrolService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/start")
    @PreAuthorize("hasRole('GUARD') or hasRole('ADMIN')")
    public ResponseEntity<Patrol> start(@RequestBody PatrolUpdateRequest request, Authentication auth) {
        Patrol patrol = patrolService.startPatrol(auth.getName(), request);
        messagingTemplate.convertAndSend("/topic/patrols", patrol);
        return ResponseEntity.ok(patrol);
    }

    @PutMapping("/{id}/location")
    @PreAuthorize("hasRole('GUARD') or hasRole('ADMIN')")
    public ResponseEntity<Patrol> updateLocation(@PathVariable Long id, @RequestBody PatrolUpdateRequest request) {
        Patrol patrol = patrolService.updateLocation(id, request);
        messagingTemplate.convertAndSend("/topic/patrols", patrol);
        return ResponseEntity.ok(patrol);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Patrol>> getActive() {
        return ResponseEntity.ok(patrolService.getActivePatrols());
    }

    @GetMapping
    public ResponseEntity<List<Patrol>> getAll() {
        return ResponseEntity.ok(patrolService.getAllPatrols());
    }

    @PutMapping("/{id}/end")
    @PreAuthorize("hasRole('GUARD') or hasRole('ADMIN')")
    public ResponseEntity<Void> end(@PathVariable Long id) {
        patrolService.endPatrol(id);
        return ResponseEntity.ok().build();
    }
}
