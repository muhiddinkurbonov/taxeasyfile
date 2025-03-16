package com.taxeasyfile.services;

import com.taxeasyfile.models.Cpa;
import com.taxeasyfile.repositories.CpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
public class CpaService {

    private CpaRepository cpaRepository;

    public CpaService(CpaRepository cpaRepository) {
        this.cpaRepository = cpaRepository;
    }

    // find by username
    public ResponseEntity<Cpa> getCpaByUsername(String username) {
        try {
            Optional<Cpa> cpa = cpaRepository.findByUsername(username);
            if(cpa.isEmpty())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(cpa.get());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
