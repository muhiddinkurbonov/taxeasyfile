package com.taxeasyfile.dtos;

import com.taxeasyfile.models.TaxReturn;

import java.math.BigDecimal;

public record TaxReturnDTO(Long id, Long clientId, Integer taxYear, TaxReturn.TaxReturnStatus taxReturnStatus,
                           String filingDate, BigDecimal totalIncome, Long categoryId,
                           Long cpaId, String fileAttachment) {
}
