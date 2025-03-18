package com.taxeasyfile.controllers;

import com.taxeasyfile.dtos.TaxReturnDTO;
import com.taxeasyfile.exception.ResourceNotFoundException;
import com.taxeasyfile.services.TaxReturnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tax-returns")
public class TaxReturnController {
    @Autowired
    private TaxReturnService taxReturnService;

    @PostMapping
    public ResponseEntity<TaxReturnDTO> createTaxReturn(
            @Valid @RequestBody TaxReturnDTO taxReturnDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaxReturnDTO created = taxReturnService.createTaxReturn(taxReturnDTO, userDetails.getUsername());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<TaxReturnDTO>> getAllTaxReturns(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<TaxReturnDTO> taxReturns = taxReturnService.getAllTaxReturns(userDetails.getUsername());
        return ResponseEntity.ok(taxReturns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaxReturnDTO> getTaxReturnById(@PathVariable Long id) {
        TaxReturnDTO taxReturn = taxReturnService.getTaxReturnById(id);
        return ResponseEntity.ok(taxReturn);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaxReturnDTO> updateTaxReturn(
            @PathVariable Long id,
            @Valid @RequestBody TaxReturnDTO taxReturnDTO) {
        TaxReturnDTO updated = taxReturnService.updateTaxReturn(id, taxReturnDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaxReturn(@PathVariable Long id) {
        taxReturnService.deleteTaxReturn(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<TaxReturnDTO>> getTaxReturnsByCategory(@PathVariable Long categoryId) {
        List<TaxReturnDTO> taxReturns = taxReturnService.getTaxReturnsByCategory(categoryId);
        return ResponseEntity.ok(taxReturns);
    }

    @PutMapping("/{id}/move-to-category/{categoryId}")
    public ResponseEntity<TaxReturnDTO> moveTaxReturnToCategory(
            @PathVariable Long id,
            @PathVariable Long categoryId) {
        TaxReturnDTO updated = taxReturnService.moveTaxReturnToCategory(id, categoryId);
        return ResponseEntity.ok(updated);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}