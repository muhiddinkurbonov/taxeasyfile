package com.taxeasyfile.repositories;

import com.taxeasyfile.models.Cpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CpaRepository extends JpaRepository<Cpa, Long> {
    Optional<Cpa> findByUsername(String username);
}
