package com.taxeasyfile.controllers;

import com.taxeasyfile.dtos.TaxReturnDTO;
import com.taxeasyfile.exception.ResourceNotFoundException;
import com.taxeasyfile.models.TaxReturn;
import com.taxeasyfile.services.TaxReturnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tax-returns")
public class TaxReturnController {

    private TaxReturnService taxReturnService;

    public TaxReturnController(TaxReturnService taxReturnService) {
        this.taxReturnService = taxReturnService;
    }

    @PostMapping
    public ResponseEntity<TaxReturnDTO> createTaxReturn(
            @Valid @RequestBody TaxReturnDTO taxReturnDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaxReturnDTO created = taxReturnService.createTaxReturn(taxReturnDTO, userDetails.getUsername());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTaxReturns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        try {
            Page<TaxReturnDTO> taxReturns = taxReturnService.getTaxReturns(page, size, sortBy, sortDir);
            Map<String, Object> response = new HashMap<>();
            response.put("content", taxReturns.getContent());
            response.put("totalElements", taxReturns.getTotalElements());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
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