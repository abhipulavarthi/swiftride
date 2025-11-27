package com.swiftride.controller;

import com.swiftride.model.Captain;
import com.swiftride.model.User;
import com.swiftride.repository.CaptainRepository;
import com.swiftride.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CaptainRepository captainRepository;

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @PostMapping("/user/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
        }
        userRepository.save(user);
        return ResponseEntity.ok(generateToken(user.getId(), "user", user));
    }

    @PostMapping("/user/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }
        return ResponseEntity.ok(generateToken(user.getId(), "user", user));
    }

    @PostMapping("/captain/signup")
    public ResponseEntity<?> registerCaptain(@RequestBody Captain captain) {
        if (captainRepository.findByEmail(captain.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Captain already exists"));
        }
        captainRepository.save(captain);
        return ResponseEntity.ok(generateToken(captain.getId(), "captain", captain));
    }

    @PostMapping("/captain/login")
    public ResponseEntity<?> loginCaptain(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        
        Captain captain = captainRepository.findByEmail(email).orElse(null);
        if (captain == null || !captain.getPassword().equals(password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }
        return ResponseEntity.ok(generateToken(captain.getId(), "captain", captain));
    }

    private Map<String, Object> generateToken(Long id, String role, Object entity) {
        String token = Jwts.builder()
                .setSubject(id.toString())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key)
                .compact();
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        if (role.equals("user")) {
            response.put("user", entity);
        } else {
            response.put("captain", entity);
        }
        return response;
    }
}
