package com.taxeasyfile.controllers;
import com.taxeasyfile.models.User;
import com.taxeasyfile.repositories.ClientRepository;
import com.taxeasyfile.repositories.TaxReturnRepository;
import com.taxeasyfile.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TaxReturnRepository taxReturnRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active) {
        List<User> users = userRepository.findAll();

        if (role != null) {
            users = users.stream()
                    .filter(u -> u.getRole().name().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        }
        if (active != null) {
            users = users.stream()
                    .filter(u -> u.isActive() == active)
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole().name());
            userMap.put("registrationDate", user.getRegistrationDate());
            userMap.put("active", user.isActive());
            return userMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }

    @GetMapping("/cpa-stats")
    public ResponseEntity<Map<String, Object>> getCpaStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalCpas = userRepository.countByRole(User.Role.CPA);
        long totalClients = clientRepository.count();
        long taxReturnsThisMonth = taxReturnRepository.countByFilingDateAfter(
                YearMonth.now().atDay(1));
        long taxReturnsThisYear = taxReturnRepository.countByFilingDateAfter(
                LocalDate.of(YearMonth.now().getYear(), 1, 1));
        long totalTaxReturns = taxReturnRepository.count();

        stats.put("totalCpas", totalCpas);
        stats.put("totalClients", totalClients);
        stats.put("avgClientsPerCpa", totalCpas > 0 ? (double) totalClients / totalCpas : 0);
        stats.put("taxReturnsThisMonth", taxReturnsThisMonth);
        stats.put("taxReturnsThisYear", taxReturnsThisYear);
        stats.put("totalTaxReturns", totalTaxReturns);

        return ResponseEntity.ok(stats);
    }

    // User Actions
    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        try {
            user.setRole(User.Role.valueOf(body.get("role")));
            userRepository.save(user);
            return ResponseEntity.ok("Role updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok("User " + (user.isActive() ? "activated" : "deactivated"));
    }

    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<String> resetUserPassword(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String newPassword = "default123"; // In practice, generate a random one and email it
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password reset to default123"); // Placeholder response
    }
}