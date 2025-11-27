package com.swiftride.controller;

import com.swiftride.model.Captain;
import com.swiftride.repository.CaptainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/captain")
@CrossOrigin(origins = "*")
public class CaptainController {

    @Autowired
    private CaptainRepository captainRepository;

    @PostMapping("/location")
    public ResponseEntity<?> updateLocation(@RequestBody Map<String, Double> location) {
        // Update logic
        return ResponseEntity.ok(Map.of("message", "Location updated"));
    }
}
