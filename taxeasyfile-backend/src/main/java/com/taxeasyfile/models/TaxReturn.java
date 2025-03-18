package com.taxeasyfile.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "tax_returns")
public class TaxReturn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "tax_year", nullable = false)
    private Integer taxYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "tax_return_status", nullable = false)
    private TaxReturnStatus taxReturnStatus = TaxReturnStatus.PENDING;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @Column(name = "total_income", precision = 12, scale = 2)
    private BigDecimal totalIncome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpa_id", nullable = false)
    private User cpa;

    @Column(name = "file_attachment", length = 255)
    private String fileAttachment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public enum TaxReturnStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public Integer getTaxYear() { return taxYear; }
    public void setTaxYear(Integer taxYear) { this.taxYear = taxYear; }
    public TaxReturnStatus getTaxReturnStatus() { return taxReturnStatus; }
    public void setTaxReturnStatus(TaxReturnStatus taxReturnStatus) { this.taxReturnStatus = taxReturnStatus; }
    public LocalDate getFilingDate() { return filingDate; }
    public void setFilingDate(LocalDate filingDate) { this.filingDate = filingDate; }
    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public User getCpa() { return cpa; }
    public void setCpa(User cpa) { this.cpa = cpa; }
    public String getFileAttachment() { return fileAttachment; }
    public void setFileAttachment(String fileAttachment) { this.fileAttachment = fileAttachment; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}