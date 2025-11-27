package com.swiftride.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "captains")
public class Captain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String role = "captain";
    
    @Embedded
    private Vehicle vehicle;

    private String status = "inactive"; // active, inactive
    
    @Embedded
    private Location location;
}
