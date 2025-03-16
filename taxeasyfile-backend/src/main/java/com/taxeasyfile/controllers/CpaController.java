package com.taxeasyfile.controllers;

import com.taxeasyfile.models.Cpa;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

}
