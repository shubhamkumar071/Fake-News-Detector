package com.truthlens.backend.service;

import com.truthlens.backend.model.AnalysisReport;
import com.truthlens.backend.model.NewsSource;
import com.truthlens.backend.repository.AnalysisReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AnalysisService.class);

    @Value("${app.nlp.service-url}")
    private String nlpServiceUrl;

    private final AnalysisReportRepository reportRepository;
    private final SourceService sourceService;
    private final RestTemplate restTemplate;

    public AnalysisService(AnalysisReportRepository reportRepository, SourceService sourceService) {
        this.reportRepository = reportRepository;
        this.sourceService = sourceService;
        this.restTemplate = new RestTemplate();
    }

    public List<AnalysisReport> getUserHistory(String userId) {
        return reportRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<AnalysisReport> getLatestReports() {
        return reportRepository.findFirst10ByOrderByCreatedAtDesc();
    }

    public Optional<AnalysisReport> getReportById(String id) {
        return reportRepository.findById(id);
    }

    public void deleteReport(String id) {
        reportRepository.deleteById(id);
    }

    public AnalysisReport runAnalysis(String text, String url, String userId) {
        AnalysisReport report = new AnalysisReport();
        report.setUserId(userId);
        report.setContent(text);
        report.setUrl(url);
        report.setCreatedAt(LocalDateTime.now());

        // Create simple title
        String title = text.trim();
        if (title.length() > 60) {
            title = title.substring(0, 57) + "...";
        }
        report.setTitle(title);

        Map<String, Object> nlpResponse = null;
        try {
            nlpResponse = callNlpMicroservice(text, url);
        } catch (Exception e) {
            logger.warn("NLP Microservice unavailable, falling back to local heuristic analysis. Error: {}", e.getMessage());
            nlpResponse = runLocalFallbackAnalysis(text);
        }

        // Map NLP service JSON response to report fields
        report.setFakeProbability((Integer) nlpResponse.getOrDefault("fakeProbability", 50));
        report.setBiasLevel((String) nlpResponse.getOrDefault("biasLevel", "Medium"));
        report.setBiasScore((Integer) nlpResponse.getOrDefault("biasScore", 50));
        report.setEmotionScore((Integer) nlpResponse.getOrDefault("emotionScore", 50));
        report.setToxicityScore((Integer) nlpResponse.getOrDefault("toxicityScore", 10));
        report.setSentiment((String) nlpResponse.getOrDefault("sentiment", "Neutral"));
        report.setSummary((String) nlpResponse.getOrDefault("summary", ""));
        report.setClickbaitScore((Integer) nlpResponse.getOrDefault("clickbaitScore", 0));
        report.setAiGeneratedProbability((Integer) nlpResponse.getOrDefault("aiGeneratedProbability", 10));
        
        // Map collections
        report.setKeywords((List<String>) nlpResponse.getOrDefault("keywords", new ArrayList<>()));
        report.setEmotions((Map<String, Integer>) nlpResponse.getOrDefault("emotions", new HashMap<>()));

        // Map manipulative phrases
        List<Map<String, Object>> phrasesData = (List<Map<String, Object>>) nlpResponse.get("manipulativePhrases");
        List<AnalysisReport.ManipulativePhrase> phrases = new ArrayList<>();
        if (phrasesData != null) {
            for (Map<String, Object> p : phrasesData) {
                phrases.add(new AnalysisReport.ManipulativePhrase(
                        (String) p.get("phrase"),
                        (String) p.get("type"),
                        (String) p.get("explanation"),
                        (Integer) p.get("startIndex"),
                        (Integer) p.get("endIndex")
                ));
            }
        }
        report.setManipulativePhrases(phrases);

        // Domain verification lookup
        NewsSource sourceInfo = null;
        if (url != null && !url.trim().isEmpty()) {
            sourceInfo = sourceService.verifySource(url);
        } else {
            sourceInfo = new NewsSource("N/A", "Text Analysis Only", "UNKNOWN", "N/A", "No link provided for verification.", "SYSTEM");
        }

        AnalysisReport.SourceVerification sourceVerification = new AnalysisReport.SourceVerification(
                sourceInfo.getDomain(),
                sourceInfo.getStatus(),
                sourceInfo.getDescription()
        );
        report.setSourceVerification(sourceVerification);

        // Adjust credibility score based on source verification
        int credibilityBase = (Integer) nlpResponse.getOrDefault("credibilityScore", 50);
        if ("TRUSTED".equals(sourceInfo.getStatus())) {
            credibilityBase = Math.min(credibilityBase + 15, 98);
        } else if ("UNTRUSTED".equals(sourceInfo.getStatus())) {
            credibilityBase = Math.max(credibilityBase - 30, 3);
            // also inflate fake probability for untrusted domains
            report.setFakeProbability(Math.min(report.getFakeProbability() + 25, 95));
        } else if ("BIASED".equals(sourceInfo.getStatus())) {
            credibilityBase = Math.max(credibilityBase - 15, 10);
        }
        report.setCredibilityScore(credibilityBase);
        report.setLanguage("English"); // standard default

        return reportRepository.save(report);
    }

    private Map<String, Object> callNlpMicroservice(String text, String url) {
        String urlEndpoint = nlpServiceUrl + "/analyze";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", text);
        if (url != null) {
            requestBody.put("url", url);
        }

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
        return restTemplate.postForObject(urlEndpoint, request, Map.class);
    }

    private Map<String, Object> runLocalFallbackAnalysis(String text) {
        Map<String, Object> fallback = new HashMap<>();
        
        // Simple regex heuristics
        String lower = text.toLowerCase();
        int clickbaitScore = 0;
        if (lower.contains("you won't believe") || lower.contains("blow your mind") || lower.contains("shocking")) {
            clickbaitScore = 80;
        } else if (lower.contains("how to") || lower.contains("why you should")) {
            clickbaitScore = 40;
        }

        int toxicityScore = 0;
        if (lower.contains("idiot") || lower.contains("hate") || lower.contains("corrupt") || lower.contains("garbage")) {
            toxicityScore = 65;
        }

        int biasScore = 30;
        String biasLevel = "Low";
        if (lower.contains("clearly") || lower.contains("obviously") || lower.contains("unbelievable") || lower.contains("crooked")) {
            biasScore = 75;
            biasLevel = "High";
        }

        int fakeProb = 15;
        if (clickbaitScore > 60 || toxicityScore > 50 || biasScore > 60) {
            fakeProb = 70;
        }

        int credibilityScore = 100 - (fakeProb / 2) - (clickbaitScore / 4) - (toxicityScore / 4);

        fallback.put("credibilityScore", credibilityScore);
        fallback.put("fakeProbability", fakeProb);
        fallback.put("biasLevel", biasLevel);
        fallback.put("biasScore", biasScore);
        fallback.put("emotionScore", 55);
        fallback.put("toxicityScore", toxicityScore);
        fallback.put("sentiment", "Neutral");
        fallback.put("clickbaitScore", clickbaitScore);
        fallback.put("aiGeneratedProbability", 25);
        fallback.put("summary", text.length() > 100 ? text.substring(0, 97) + "..." : text);
        fallback.put("keywords", Arrays.asList("Fallback", "Analysis", "Local"));

        Map<String, Integer> emotions = new HashMap<>();
        emotions.put("fear", 20);
        emotions.put("anger", toxicityScore / 2);
        emotions.put("joy", 10);
        emotions.put("sadness", 15);
        fallback.put("emotions", emotions);

        List<Map<String, Object>> phrases = new ArrayList<>();
        // Highlight fallback words
        String[] keywordsToHighlight = {"shocking", "corrupt", "clearly", "obviously"};
        for (String word : keywordsToHighlight) {
            int index = lower.indexOf(word);
            if (index != -1) {
                Map<String, Object> phrase = new HashMap<>();
                phrase.put("phrase", text.substring(index, index + word.length()));
                phrase.put("type", "Linguistic Heuristics");
                phrase.put("explanation", "Detected emotive/unsupported text during local fallback parsing.");
                phrase.put("startIndex", index);
                phrase.put("endIndex", index + word.length());
                phrases.add(phrase);
            }
        }
        fallback.put("manipulativePhrases", phrases);

        return fallback;
    }
}
