package com.taxeasyfile.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private String secret;
    private long expirationTime;
    private long refreshExpirationTime;

    // Getters and setters
    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(long expirationTime) {
        this.expirationTime = expirationTime;
    }

    public long getRefreshExpirationTime() {
        return refreshExpirationTime;
    }

    public void setRefreshExpirationTime(long refreshExpirationTime) {
        this.refreshExpirationTime = refreshExpirationTime;
    }
}
