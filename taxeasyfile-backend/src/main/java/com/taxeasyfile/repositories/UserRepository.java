package com.taxeasyfile.repositories;

import com.taxeasyfile.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    long countByRole(User.Role role);

    Optional<User> findByRefreshToken(String refreshToken);

    List<User> findByRole(User.Role role);
}
