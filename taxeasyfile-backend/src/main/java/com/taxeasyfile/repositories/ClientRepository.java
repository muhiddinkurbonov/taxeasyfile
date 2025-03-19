package com.taxeasyfile.repositories;

import com.taxeasyfile.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCpaId(Long cpaId);
    boolean existsByTin(String tin);
}
