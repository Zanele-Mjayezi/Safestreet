package com.safestreet.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType type;

    @Column(length = 1000)
    private String description;

    private String location;
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @Enumerated(EnumType.STRING)
    private IncidentStatus status = IncidentStatus.ACTIVE;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum IncidentType {
        THEFT, VANDALISM, SUSPICIOUS_PERSON, TRAFFIC_INCIDENT, SAFETY_HAZARD, DISTURBANCE, OTHER
    }

    public enum IncidentStatus {
        ACTIVE, PENDING, RESOLVED
    }
}
