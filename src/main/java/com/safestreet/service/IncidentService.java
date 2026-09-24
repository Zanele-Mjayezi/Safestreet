package com.safestreet.service;

import com.safestreet.dto.IncidentRequest;
import com.safestreet.model.Incident;
import com.safestreet.model.User;
import com.safestreet.repository.IncidentRepository;
import com.safestreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {
    @Autowired
    private IncidentRepository incidentRepository;
    @Autowired
    private UserRepository userRepository;

    public Incident reportIncident(IncidentRequest request, String username) {
        User reporter = userRepository.findByUsername(username).orElseThrow();
        Incident incident = Incident.builder()
                .type(request.getType())
                .description(request.getDescription())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .reporter(reporter)
                .status(Incident.IncidentStatus.ACTIVE)
                .build();
        return incidentRepository.save(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Incident> getActiveIncidents() {
        return incidentRepository.findByStatusOrderByCreatedAtDesc(Incident.IncidentStatus.ACTIVE);
    }

    public List<Incident> getMyIncidents(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return incidentRepository.findByReporterIdOrderByCreatedAtDesc(user.getId());
    }

    public Incident resolveIncident(Long id) {
        Incident incident = incidentRepository.findById(id).orElseThrow();
        incident.setStatus(Incident.IncidentStatus.RESOLVED);
        return incidentRepository.save(incident);
    }
}
