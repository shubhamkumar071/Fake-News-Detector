package com.truthlens.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class NewsSourceDto {

    @NotBlank(message = "Domain is required")
    private String domain;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Status is required (e.g. TRUSTED, UNTRUSTED, BIASED)")
    private String status;

    private String category;
    private String description;

    public NewsSourceDto() {}

    public NewsSourceDto(String domain, String name, String status, String category, String description) {
        this.domain = domain;
        this.name = name;
        this.status = status;
        this.category = category;
        this.description = description;
    }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
