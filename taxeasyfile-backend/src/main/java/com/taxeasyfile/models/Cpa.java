package com.taxeasyfile.models;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "cpas")
public class Cpa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="cpa_username", nullable = false, unique = true)
    private String username;

    @Column(name="cpa_password", nullable = false)
    private String password;

    @Column(name="cpa_email", nullable = false, unique = true)
    private String email;

    @Column(name="created_at")
    private Timestamp createdAt;

    public Cpa() {}

    public Cpa(Long id, String username, String password, String email, Timestamp createdAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCpaUsername() {
        return username;
    }

    public void setCpaUsername(String cpaUsername) {
        this.username = cpaUsername;
    }

    public String getCpaPassword() {
        return password;
    }

    public void setCpaPassword(String cpaPassword) {
        this.password = cpaPassword;
    }

    public String getCpaEmail() {
        return email;
    }

    public void setCpaEmail(String cpaEmail) {
        this.email = cpaEmail;
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
                ", cpaUsername='" + username + '\'' +
                ", cpaPassword='" + password + '\'' +
                ", cpaEmail='" + email + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
