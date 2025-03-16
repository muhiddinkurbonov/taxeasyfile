package com.taxeasyfile.models;

import jakarta.persistence.*;

import java.security.Timestamp;

@Entity
@Table(name = "cpas")
public class Cpa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="cpa_username", nullable = false, unique = true)
    private String cpaUsername;

    @Column(name="cpa_password", nullable = false)
    private String cpaPassword;

    @Column(name="cpa_email", nullable = false, unique = true)
    private String cpaEmail;

    @Column(name="created_at")
    private Timestamp createdAt;

    public Cpa(Long id, String cpaUsername, String cpaPassword, String cpaEmail, Timestamp createdAt) {
        this.id = id;
        this.cpaUsername = cpaUsername;
        this.cpaPassword = cpaPassword;
        this.cpaEmail = cpaEmail;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCpaUsername() {
        return cpaUsername;
    }

    public void setCpaUsername(String cpaUsername) {
        this.cpaUsername = cpaUsername;
    }

    public String getCpaPassword() {
        return cpaPassword;
    }

    public void setCpaPassword(String cpaPassword) {
        this.cpaPassword = cpaPassword;
    }

    public String getCpaEmail() {
        return cpaEmail;
    }

    public void setCpaEmail(String cpaEmail) {
        this.cpaEmail = cpaEmail;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Cpa{" +
                "id=" + id +
                ", cpaUsername='" + cpaUsername + '\'' +
                ", cpaPassword='" + cpaPassword + '\'' +
                ", cpaEmail='" + cpaEmail + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
