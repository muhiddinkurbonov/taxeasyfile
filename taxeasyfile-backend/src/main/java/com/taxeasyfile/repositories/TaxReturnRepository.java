package com.taxeasyfile.repositories;

import com.taxeasyfile.models.TaxReturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaxReturnRepository extends JpaRepository<TaxReturn, Long> {
    long count();
    List<TaxReturn> findByCpaId(Long cpaId);
    List<TaxReturn> findByCategoryId(Long categoryId);
    long countByTaxYear(Integer taxYear);
    long countByFilingDateAfter(LocalDate date);

    Page<TaxReturn> findByClientIdIn(List<Long> clientIds, Pageable pageable);
}
