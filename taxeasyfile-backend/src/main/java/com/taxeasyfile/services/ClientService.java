package com.taxeasyfile.services;

import com.taxeasyfile.dtos.ClientDTO;
import com.taxeasyfile.exception.DuplicateResourceException;
import com.taxeasyfile.exception.ResourceNotFoundException;
import com.taxeasyfile.models.Client;
import com.taxeasyfile.models.User;
import com.taxeasyfile.repositories.ClientRepository;
import com.taxeasyfile.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ClientDTO> getClientsByCpa(String cpaUsername) {
        User cpa = userRepository.findByUsername(cpaUsername)
                .orElseThrow(() -> new ResourceNotFoundException("CPA not found: " + cpaUsername));
        return clientRepository.findByCpaId(cpa.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClientDTO createClient(ClientDTO dto, String cpaUsername) {
        // Validate inputs
        if (dto.name() == null || dto.name().isBlank() || dto.tin() == null || dto.tin().isBlank()) {
            throw new IllegalArgumentException("Client name and TIN cannot be empty.");
        }

        if (clientRepository.existsByTin(dto.tin())) {
            throw new DuplicateResourceException("A client with TIN " + dto.tin() + " already exists.");
        }

        User cpa = userRepository.findByUsername(cpaUsername)
                .orElseThrow(() -> new ResourceNotFoundException("CPA not found: " + cpaUsername));

        Client client = new Client();
        client.setName(dto.name());
        client.setTin(dto.tin());
        client.setEmail(dto.email());
        client.setCpaId(cpa.getId());
        Client saved = clientRepository.save(client);

        return toDTO(saved);
    }

    public ClientDTO updateClient(Long id, ClientDTO dto, String cpaUsername) {
        User cpa = userRepository.findByUsername(cpaUsername)
                .orElseThrow(() -> new ResourceNotFoundException("CPA not found: " + cpaUsername));
        Client client = clientRepository.findById(id)
                .filter(cl -> cl.getCpaId().equals(cpa.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Client not found or not owned by CPA: " + id));
        client.setName(dto.name());
        client.setTin(dto.tin());
        client.setEmail(dto.email());
        Client updated = clientRepository.save(client);
        return toDTO(updated);
    }

    public void deleteClient(Long id, String cpaUsername) {
        User cpa = userRepository.findByUsername(cpaUsername)
                .orElseThrow(() -> new ResourceNotFoundException("CPA not found: " + cpaUsername));
        Client client = clientRepository.findById(id)
                .filter(cl -> cl.getCpaId().equals(cpa.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Client not found or not owned by CPA: " + id));
        clientRepository.delete(client);
    }

    private ClientDTO toDTO(Client client) {
        return new ClientDTO(client.getId(), client.getName(), client.getTin(), client.getEmail(), client.getCpaId());
    }
}