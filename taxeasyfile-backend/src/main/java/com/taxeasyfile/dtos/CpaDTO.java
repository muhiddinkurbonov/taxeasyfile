package com.taxeasyfile.dtos;

import java.time.LocalDateTime;

public record CpaDTO(Long id, String username, String password, String email, LocalDateTime createdAt) {
}
