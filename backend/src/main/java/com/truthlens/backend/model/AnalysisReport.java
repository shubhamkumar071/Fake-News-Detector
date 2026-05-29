package com.truthlens.backend.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "analysisReports")
public class AnalysisReport {

    @Id
    private String id;
    private String userId;
    private String title;
    private String content;
    private String url;
    
    private int credibilityScore;
    private int fakeProbability;
    private String biasLevel;
    private int biasScore;
    private int emotionScore;
    private int toxicityScore;
    private String sentiment;
    private String summary;
    private List<String> keywords;
    
    private List<ManipulativePhrase> manipulativePhrases;
    private SourceVerification sourceVerification;
    
    private String language;
    private int clickbaitScore;
    private int aiGeneratedProbability;
    private Map<String, Integer> emotions;

    @CreatedDate
    private LocalDateTime createdAt;

    public AnalysisReport() {}

    // Nested classes
    public static class ManipulativePhrase {
        private String phrase;
        private String type;
        private String explanation;
        private int startIndex;
        private int endIndex;

        public ManipulativePhrase() {}

        public ManipulativePhrase(String phrase, String type, String explanation, int startIndex, int endIndex) {
            this.phrase = phrase;
            this.type = type;
            this.explanation = explanation;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
        }

        // Getters and Setters
        public String getPhrase() { return phrase; }
        public void setPhrase(String phrase) { this.phrase = phrase; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }

        public int getStartIndex() { return startIndex; }
        public void setStartIndex(int startIndex) { this.startIndex = startIndex; }

        public int getEndIndex() { return endIndex; }
        public void setEndIndex(int endIndex) { this.endIndex = endIndex; }
    }

    public static class SourceVerification {
        private String domain;
        private String status; // TRUSTED, UNTRUSTED, BIASED, UNKNOWN
        private String description;

        public SourceVerification() {}

        public SourceVerification(String domain, String status, String description) {
            this.domain = domain;
            this.status = status;
            this.description = description;
        }

        // Getters and Setters
        public String getDomain() { return domain; }
        public void setDomain(String domain) { this.domain = domain; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public int getCredibilityScore() { return credibilityScore; }
    public void setCredibilityScore(int credibilityScore) { this.credibilityScore = credibilityScore; }

    public int getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(int fakeProbability) { this.fakeProbability = fakeProbability; }

    public String getBiasLevel() { return biasLevel; }
    public void setBiasLevel(String biasLevel) { this.biasLevel = biasLevel; }

    public int getBiasScore() { return biasScore; }
    public void setBiasScore(int biasScore) { this.biasScore = biasScore; }

    public int getEmotionScore() { return emotionScore; }
    public void setEmotionScore(int emotionScore) { this.emotionScore = emotionScore; }

    public int getToxicityScore() { return toxicityScore; }
    public void setToxicityScore(int toxicityScore) { this.toxicityScore = toxicityScore; }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }

    public List<ManipulativePhrase> getManipulativePhrases() { return manipulativePhrases; }
    public void setManipulativePhrases(List<ManipulativePhrase> manipulativePhrases) { this.manipulativePhrases = manipulativePhrases; }

    public SourceVerification getSourceVerification() { return sourceVerification; }
    public void setSourceVerification(SourceVerification sourceVerification) { this.sourceVerification = sourceVerification; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public int getClickbaitScore() { return clickbaitScore; }
    public void setClickbaitScore(int clickbaitScore) { this.clickbaitScore = clickbaitScore; }

    public int getAiGeneratedProbability() { return aiGeneratedProbability; }
    public void setAiGeneratedProbability(int aiGeneratedProbability) { this.aiGeneratedProbability = aiGeneratedProbability; }

    public Map<String, Integer> getEmotions() { return emotions; }
    public void setEmotions(Map<String, Integer> emotions) { this.emotions = emotions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
