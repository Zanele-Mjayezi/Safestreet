package com.safestreet.controller;

import com.safestreet.dto.IncidentRequest;
import com.safestreet.model.Incident;
import com.safestreet.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {
    @Autowired
    private IncidentService incidentService;

    @PostMapping
    public ResponseEntity<Incident> report(@Valid @RequestBody IncidentRequest request, Authentication auth) {
        return ResponseEntity.ok(incidentService.reportIncident(request, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAll() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Incident>> getActive() {
        return ResponseEntity.ok(incidentService.getActiveIncidents());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Incident>> getMy(Authentication auth) {
        return ResponseEntity.ok(incidentService.getMyIncidents(auth.getName()));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GUARD')")
    public ResponseEntity<Incident> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.resolveIncident(id));
    }
}
