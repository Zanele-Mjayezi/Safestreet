package com.safestreet.service;

import com.safestreet.dto.PatrolUpdateRequest;
import com.safestreet.model.Patrol;
import com.safestreet.model.User;
import com.safestreet.repository.PatrolRepository;
import com.safestreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatrolService {
    @Autowired
    private PatrolRepository patrolRepository;
    @Autowired
    private UserRepository userRepository;

    public Patrol startPatrol(String username, PatrolUpdateRequest request) {
        User guard = userRepository.findByUsername(username).orElseThrow();
        Patrol patrol = Patrol.builder()
                .guard(guard)
                .status(Patrol.PatrolStatus.ACTIVE)
                .currentLat(request.getLatitude())
                .currentLng(request.getLongitude())
                .patrolArea(request.getPatrolArea())
                .build();
        return patrolRepository.save(patrol);
    }

    public Patrol updateLocation(Long patrolId, PatrolUpdateRequest request) {
        Patrol patrol = patrolRepository.findById(patrolId).orElseThrow();
        patrol.setCurrentLat(request.getLatitude());
        patrol.setCurrentLng(request.getLongitude());
        return patrolRepository.save(patrol);
    }

    public List<Patrol> getActivePatrols() {
        return patrolRepository.findByStatus(Patrol.PatrolStatus.ACTIVE);
    }

    public List<Patrol> getAllPatrols() {
        return patrolRepository.findAllByOrderByStartTimeDesc();
    }

    public void endPatrol(Long id) {
        Patrol patrol = patrolRepository.findById(id).orElseThrow();
        patrol.setStatus(Patrol.PatrolStatus.COMPLETED);
        patrolRepository.save(patrol);
    }
}
