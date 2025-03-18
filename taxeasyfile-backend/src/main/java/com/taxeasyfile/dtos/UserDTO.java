package com.taxeasyfile.dtos;

public record UserDTO(String username, String password, String email, String role) {
    public UserDTO {
        if (role != null && !role.equals("CPA") && !role.equals("ADMIN")) {
            throw new IllegalArgumentException("Role must be CPA or ADMIN");
        }
    }
}