package com.taxeasyfile.repositories;

import com.taxeasyfile.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
