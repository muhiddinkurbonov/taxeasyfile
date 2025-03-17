package com.taxeasyfile.controllers;

import com.taxeasyfile.dtos.CpaDTO;
import com.taxeasyfile.models.Cpa;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.taxeasyfile.services.CpaService;


@RestController
@RequestMapping("/api/cpas")
public class CpaController {
    private CpaService cpaService;

    public CpaController(CpaService cpaService) {
        this.cpaService = cpaService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<Cpa> getCpaByUsername(@PathVariable String username) {
        return cpaService.getCpaByUsername(username);
    }

    @PostMapping
    public ResponseEntity<Cpa> createCpa(@RequestBody CpaDTO dto) {
        return cpaService.createCpa(dto);
    }

}
