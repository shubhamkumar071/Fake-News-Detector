package com.truthlens.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AnalysisRequest {

    @NotBlank(message = "Text to analyze is required")
    private String text;

    private String url;

    public AnalysisRequest() {}

    public AnalysisRequest(String text, String url) {
        this.text = text;
        this.url = url;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
