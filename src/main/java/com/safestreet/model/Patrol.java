package com.safestreet.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patrols")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patrol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "guard_id", nullable = false)
    private User guard;

    @Enumerated(EnumType.STRING)
    private PatrolStatus status = PatrolStatus.ACTIVE;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Double currentLat;
    private Double currentLng;
    private String patrolArea;

    @PrePersist
    protected void onCreate() {
        startTime = LocalDateTime.now();
    }

    public enum PatrolStatus {
        ACTIVE, COMPLETED, PAUSED
    }
}
