package com.taxeasyfile.dtos;

import java.sql.Timestamp;

public record CpaDTO(Long id, String username, String password, String email, Timestamp createdAt) {
}
