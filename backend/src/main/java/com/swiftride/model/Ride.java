package com.swiftride.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
@Table(name = "rides")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Captain captain;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "address", column = @Column(name = "pickup_address")),
        @AttributeOverride(name = "lat", column = @Column(name = "pickup_lat")),
        @AttributeOverride(name = "lon", column = @Column(name = "pickup_lon"))
    })
    private Location pickup;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "address", column = @Column(name = "destination_address")),
        @AttributeOverride(name = "lat", column = @Column(name = "destination_lat")),
        @AttributeOverride(name = "lon", column = @Column(name = "destination_lon"))
    })
    private Location destination;

    private String status = "pending"; // pending, accepted, ongoing, completed, cancelled
    
    private Double fare;
    private Double distance;
    private Double duration;
    
    private String otp;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();
}
