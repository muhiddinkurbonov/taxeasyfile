package com.taxeasyfile.repositories;

import com.taxeasyfile.models.TaxReturn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxReturnRepository extends JpaRepository<TaxReturn, Long> {
    List<TaxReturn> findByCpaId(Long cpaId);
    List<TaxReturn> findByCategoryId(Long categoryId);
    long countByTaxYear(Integer taxYear);
}
