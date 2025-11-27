package com.swiftride.repository;

import com.swiftride.model.Captain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CaptainRepository extends JpaRepository<Captain, Long> {
    Optional<Captain> findByEmail(String email);
}
