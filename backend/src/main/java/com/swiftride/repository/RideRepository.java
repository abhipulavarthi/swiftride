package com.swiftride.repository;

import com.swiftride.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByStatus(String status);
    List<Ride> findByUserId(Long userId);
}
