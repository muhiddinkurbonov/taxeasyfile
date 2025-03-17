package com.taxeasyfile.services;

import com.taxeasyfile.dtos.CpaDTO;
import com.taxeasyfile.models.Cpa;
import com.taxeasyfile.repositories.CpaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.net.URI;
import java.util.Optional;

@Service
public class CpaService {

    @Value("${base-url}")
    private String baseURL;

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

    public ResponseEntity<Cpa> createCpa(CpaDTO dto) {
        try {
            Cpa createdCpa = cpaRepository.save(new Cpa(0L, dto.username(), dto.password(), dto.email(), dto.createdAt()));
            return ResponseEntity.created(new URI(this.baseURL + "cpas/" + createdCpa.getId())).body(createdCpa);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

}
