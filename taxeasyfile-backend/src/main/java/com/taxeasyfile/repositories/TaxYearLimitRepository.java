package com.taxeasyfile.repositories;

import com.taxeasyfile.models.TaxYearLimit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaxYearLimitRepository extends JpaRepository<TaxYearLimit, Long> {
    Optional<TaxYearLimit> findByTaxYear(Integer taxYear);
}