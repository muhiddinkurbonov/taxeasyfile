package com.taxeasyfile.controllers;

import com.taxeasyfile.config.JwtUtil;
import com.taxeasyfile.dtos.UserDTO;
import com.taxeasyfile.models.User;
import com.taxeasyfile.repositories.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username());
        final Map<String, String> tokens = jwtUtil.generateTokens(userDetails);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.username())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        if (userRepository.existsByEmail(userDTO.email())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        User user = new User();
        user.setUsername(userDTO.username());
        user.setEmail(userDTO.email());
        user.setPassword(passwordEncoder.encode(userDTO.password()));

        try {
            user.setRole(User.Role.valueOf(userDTO.role()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role provided. Role must be CPA or ADMIN.");
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@RequestBody RefreshRequest refreshRequest) {
        User user = userRepository.findByRefreshToken(refreshRequest.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String newJwt = jwtUtil.generateTokens(userDetails).get("jwt");
        return ResponseEntity.ok(newJwt);
    }

    record AuthRequest(
            @NotBlank(message = "Username is required")
            String username,

            @NotBlank(message = "Password is required")
            String password
    ) {
    }

    record RefreshRequest(String refreshToken) {}
}