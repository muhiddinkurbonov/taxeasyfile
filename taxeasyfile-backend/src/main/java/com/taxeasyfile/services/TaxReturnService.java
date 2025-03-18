package com.taxeasyfile.services;

import com.taxeasyfile.dtos.TaxReturnDTO;
import com.taxeasyfile.exception.ResourceNotFoundException;
import com.taxeasyfile.models.*;
import com.taxeasyfile.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaxReturnService {
    @Autowired
    private TaxReturnRepository taxReturnRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaxYearLimitRepository taxYearLimitRepository;

    public TaxReturnDTO createTaxReturn(TaxReturnDTO dto, String cpaUsername) {
        User cpa = userRepository.findByUsername(cpaUsername)
                .orElseThrow(() -> new ResourceNotFoundException("CPA not found: " + cpaUsername));

        // Check workload capacity
        checkWorkloadCapacity(cpa.getId(), dto.taxYear());

        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + dto.clientId()));
        Category category = dto.categoryId() != null ?
                categoryRepository.findById(dto.categoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.categoryId()))
                : null;

        TaxReturn taxReturn = new TaxReturn();
        taxReturn.setClient(client);
        taxReturn.setTaxYear(dto.taxYear());
        taxReturn.setTaxReturnStatus(dto != null ? dto.taxReturnStatus(): TaxReturn.TaxReturnStatus.PENDING);
        taxReturn.setFilingDate(dto.filingDate() != null ? LocalDate.parse(dto.filingDate()) : null);
        taxReturn.setTotalIncome(dto.totalIncome());
        taxReturn.setCategory(category);
        taxReturn.setCpa(cpa);
        taxReturn.setFileAttachment(dto.fileAttachment());

        TaxReturn saved = taxReturnRepository.save(taxReturn);
        return toDTO(saved);
    }

    public List<TaxReturnDTO> getAllTaxReturns(String cpaUsername) {
        User cpa = userRepository.findByUsername(cpaUsername)
                .orElseThrow(() -> new ResourceNotFoundException("CPA not found: " + cpaUsername));
        return taxReturnRepository.findByCpaId(cpa.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TaxReturnDTO getTaxReturnById(Long id) {
        TaxReturn taxReturn = taxReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax return not found: " + id));
        return toDTO(taxReturn);
    }

    public TaxReturnDTO updateTaxReturn(Long id, TaxReturnDTO dto) {
        TaxReturn taxReturn = taxReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax return not found: " + id));

        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + dto.clientId()));
        Category category = dto.categoryId() != null ?
                categoryRepository.findById(dto.categoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.categoryId()))
                : null;

        taxReturn.setClient(client);
        taxReturn.setTaxYear(dto.taxYear());
        taxReturn.setTaxReturnStatus(dto.taxReturnStatus());
        taxReturn.setFilingDate(dto.filingDate() != null ? LocalDate.parse(dto.filingDate()) : null);
        taxReturn.setTotalIncome(dto.totalIncome());
        taxReturn.setCategory(category);
        taxReturn.setFileAttachment(dto.fileAttachment());

        TaxReturn updated = taxReturnRepository.save(taxReturn);
        return toDTO(updated);
    }

    public void deleteTaxReturn(Long id) {
        TaxReturn taxReturn = taxReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax return not found: " + id));
        taxReturnRepository.delete(taxReturn);
    }

    public List<TaxReturnDTO> getTaxReturnsByCategory(Long categoryId) {
        return taxReturnRepository.findByCategoryId(categoryId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TaxReturnDTO moveTaxReturnToCategory(Long taxReturnId, Long newCategoryId) {
        TaxReturn taxReturn = taxReturnRepository.findById(taxReturnId)
                .orElseThrow(() -> new ResourceNotFoundException("Tax return not found: " + taxReturnId));
        Category newCategory = categoryRepository.findById(newCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + newCategoryId));
        taxReturn.setCategory(newCategory);
        TaxReturn updated = taxReturnRepository.save(taxReturn);
        return toDTO(updated);
    }

    private TaxReturnDTO toDTO(TaxReturn taxReturn) {
        return new TaxReturnDTO(
                taxReturn.getId(),
                taxReturn.getClient().getId(),
                taxReturn.getTaxYear(),
                taxReturn.getTaxReturnStatus(),
                taxReturn.getFilingDate() != null ? taxReturn.getFilingDate().toString() : null,
                taxReturn.getTotalIncome(),
                taxReturn.getCategory() != null ? taxReturn.getCategory().getId() : null,
                taxReturn.getCpa().getId(),
                taxReturn.getFileAttachment()
        );
    }

    private void checkWorkloadCapacity(Long cpaId, Integer taxYear) {
        TaxYearLimit limit = taxYearLimitRepository.findByTaxYear(taxYear)
                .orElse(null);
        if (limit != null) {
            long currentCount = taxReturnRepository.findByCpaId(cpaId).stream()
                    .filter(tr -> tr.getTaxYear().equals(taxYear))
                    .count();
            if (currentCount >= limit.getMaxCapacity()) {
                throw new IllegalStateException("CPA has reached maximum capacity for tax year " + taxYear);
            }
        }
    }
}