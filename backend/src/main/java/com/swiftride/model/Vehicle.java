package com.swiftride.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Vehicle {
    private String color;
    private String plate;
    private Integer capacity;
    private String vehicleType; // bike, auto, cab
}
