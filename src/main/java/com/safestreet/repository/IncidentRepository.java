package com.safestreet.repository;

import com.safestreet.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatusOrderByCreatedAtDesc(Incident.IncidentStatus status);
    List<Incident> findByReporterIdOrderByCreatedAtDesc(Long reporterId);
    List<Incident> findAllByOrderByCreatedAtDesc();
}
