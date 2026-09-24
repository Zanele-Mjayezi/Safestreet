package com.safestreet.dto;

import com.safestreet.model.Incident;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentRequest {
    @NotNull
    private Incident.IncidentType type;
    @NotBlank
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
}
