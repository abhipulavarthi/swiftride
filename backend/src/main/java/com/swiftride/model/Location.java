package com.swiftride.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Location {
    private String address;
    private Double lat;
    private Double lon;
}
