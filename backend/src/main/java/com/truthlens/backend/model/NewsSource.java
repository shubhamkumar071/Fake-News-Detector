package com.truthlens.backend.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "newsSources")
public class NewsSource {

    @Id
    private String id;

    @Indexed(unique = true)
    private String domain; // e.g. fakenews.com

    private String name;
    private String status; // TRUSTED, UNTRUSTED, BIASED
    private String category; // Mainstream, Satire, Conspiracy, State-Media
    private String description;
    private String addedBy;

    @CreatedDate
    private LocalDateTime createdAt;

    public NewsSource() {}

    public NewsSource(String domain, String name, String status, String category, String description, String addedBy) {
        this.domain = domain;
        this.name = name;
        this.status = status;
        this.category = category;
        this.description = description;
        this.addedBy = addedBy;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getAddedBy() { return addedBy; }
    public void setAddedBy(String addedBy) { this.addedBy = addedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
