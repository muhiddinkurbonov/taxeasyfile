package com.taxeasyfile.controllers;

import com.taxeasyfile.dtos.ClientDTO;
import com.taxeasyfile.exception.DuplicateResourceException;
import com.taxeasyfile.exception.ResourceNotFoundException;
import com.taxeasyfile.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getClients(@AuthenticationPrincipal UserDetails userDetails) {
        List<ClientDTO> clients = clientService.getClientsByCpa(userDetails.getUsername());
        return ResponseEntity.ok(clients);
    }

    @PostMapping
    public ResponseEntity<?> createClient(
            @RequestBody ClientDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            ClientDTO created = clientService.createClient(dto, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to create client"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(
            @PathVariable Long id,
            @RequestBody ClientDTO clientDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        ClientDTO updated = clientService.updateClient(id, clientDTO, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        clientService.deleteClient(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}

record ErrorResponse(String message) {}