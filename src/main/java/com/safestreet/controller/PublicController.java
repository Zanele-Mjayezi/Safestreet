package com.safestreet.controller;

import com.safestreet.model.Incident;
import com.safestreet.model.Patrol;
import com.safestreet.service.IncidentService;
import com.safestreet.service.PatrolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicController {
    @Autowired
    private IncidentService incidentService;
    @Autowired
    private PatrolService patrolService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Incident> all = incidentService.getAllIncidents();
        List<Incident> active = incidentService.getActiveIncidents();
        List<Patrol> patrols = patrolService.getActivePatrols();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalIncidents", all.size());
        stats.put("activeIncidents", active.size());
        stats.put("activePatrols", patrols.size());
        stats.put("recentIncidents", all.stream().limit(5).toList());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<Incident>> getPublicIncidents() {
        return ResponseEntity.ok(incidentService.getActiveIncidents());
    }

    @GetMapping("/patrols")
    public ResponseEntity<List<Patrol>> getPublicPatrols() {
        return ResponseEntity.ok(patrolService.getActivePatrols());
    }
}
