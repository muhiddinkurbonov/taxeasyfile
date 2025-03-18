package com.taxeasyfile.services;

import com.taxeasyfile.dtos.UserDTO;
import com.taxeasyfile.models.User;
import com.taxeasyfile.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.username());
        user.setPassword(passwordEncoder.encode(userDTO.password()));
        user.setEmail(userDTO.email());
        user.setRole(userDTO.role() != null ? User.Role.valueOf(userDTO.role()) : User.Role.CPA);
        return userRepository.save(user);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(
                user.getUsername(),
                null,
                user.getEmail(),
                user.getRole().name()
        );
    }

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return new UserDTO(
                user.getUsername(),
                null,
                user.getEmail(),
                user.getRole().name()
        );
    }
}