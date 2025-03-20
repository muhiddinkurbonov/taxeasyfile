package com.taxeasyfile.controllers;

import com.taxeasyfile.dtos.ClientDTO;
import com.taxeasyfile.exception.*;
import com.taxeasyfile.models.Client;
import com.taxeasyfile.models.User;
import com.taxeasyfile.repositories.ClientRepository;
import com.taxeasyfile.repositories.UserRepository;
import com.taxeasyfile.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @Autowired
    private UserRepository userRepository;


    private ClientRepository clientRepository;

    public  ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getClients(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("ADMIN".equals(user.getRole().name())) {
            return ResponseEntity.ok(clientRepository.findAll());
        } else if ("CPA".equals(user.getRole().name())) {
            return ResponseEntity.ok(clientRepository.findByCpaId(user.getId()));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createClient(
            @RequestBody ClientDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            ClientDTO created = clientService.createClient(dto, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException | DuplicateResourceException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create client");
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

