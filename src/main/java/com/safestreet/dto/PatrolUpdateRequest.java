package com.safestreet.dto;

import lombok.Data;

@Data
public class PatrolUpdateRequest {
    private Double latitude;
    private Double longitude;
    private String patrolArea;
}
