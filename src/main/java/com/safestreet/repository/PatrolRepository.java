package com.safestreet.repository;

import com.safestreet.model.Patrol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatrolRepository extends JpaRepository<Patrol, Long> {
    List<Patrol> findByStatus(Patrol.PatrolStatus status);
    Optional<Patrol> findByGuardIdAndStatus(Long guardId, Patrol.PatrolStatus status);
    List<Patrol> findAllByOrderByStartTimeDesc();
}
