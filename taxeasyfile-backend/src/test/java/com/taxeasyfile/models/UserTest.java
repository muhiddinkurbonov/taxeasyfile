package com.taxeasyfile.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class UserTest {

    private User user;

    @BeforeEach
    public void setUp() {
        user = new User();
    }

    @Test
    public void testGettersAndSetters() {
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setEmail("test@example.com");
        user.setRole(User.Role.ADMIN);
        user.setActive(false);
        user.setRefreshToken("refresh-token-123");

        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now();
        LocalDateTime registrationDate = LocalDateTime.now();

        user.setCreatedAt(createdAt);
        user.setUpdatedAt(updatedAt);
        user.setRegistrationDate(registrationDate);

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getUsername()).isEqualTo("testuser");
        assertThat(user.getPassword()).isEqualTo("password123");
        assertThat(user.getEmail()).isEqualTo("test@example.com");
        assertThat(user.getRole()).isEqualTo(User.Role.ADMIN);
        assertThat(user.isActive()).isFalse();
        assertThat(user.getRefreshToken()).isEqualTo("refresh-token-123");
        assertThat(user.getCreatedAt()).isEqualTo(createdAt);
        assertThat(user.getUpdatedAt()).isEqualTo(updatedAt);
        assertThat(user.getRegistrationDate()).isEqualTo(registrationDate);
    }

    @Test
    public void testPrePersistSetsRegistrationDate() {
        user.setRegistrationDate(null);
        user.prePersist();

        assertThat(user.getRegistrationDate()).isNotNull();
    }

    @Test
    public void testPreUpdateSetsUpdatedAt() {
        Instant before = user.getUpdatedAt();
        user.preUpdate();
        Instant after = user.getUpdatedAt();

        assertThat(after).isAfterOrEqualTo(before);
    }
}
