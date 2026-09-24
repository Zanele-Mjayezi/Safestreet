package com.safestreet.dto;

import lombok.Data;

@Data
public class EmergencyRequest {
    private Double latitude;
    private Double longitude;
    private String location;
}
