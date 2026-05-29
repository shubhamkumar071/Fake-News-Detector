package com.truthlens.backend.service;

import com.truthlens.backend.model.NewsSource;
import com.truthlens.backend.repository.NewsSourceRepository;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@Service
public class SourceService {

    private final NewsSourceRepository sourceRepository;

    public SourceService(NewsSourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }

    public List<NewsSource> getAllSources() {
        return sourceRepository.findAll();
    }

    public Optional<NewsSource> findByDomain(String domain) {
        return sourceRepository.findByDomain(cleanDomain(domain));
    }

    public NewsSource addSource(NewsSource source) {
        source.setDomain(cleanDomain(source.getDomain()));
        if (sourceRepository.existsByDomain(source.getDomain())) {
            throw new IllegalArgumentException("Domain source record already exists");
        }
        return sourceRepository.save(source);
    }

    public NewsSource updateSource(String id, NewsSource updatedSource) {
        NewsSource existing = sourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Source record not found"));
        existing.setName(updatedSource.getName());
        existing.setStatus(updatedSource.getStatus());
        existing.setCategory(updatedSource.getCategory());
        existing.setDescription(updatedSource.getDescription());
        return sourceRepository.save(existing);
    }

    public void deleteSource(String id) {
        if (!sourceRepository.existsById(id)) {
            throw new IllegalArgumentException("Source record does not exist");
        }
        sourceRepository.deleteById(id);
    }

    public NewsSource verifySource(String urlOrDomain) {
        String domain = extractDomain(urlOrDomain);
        return sourceRepository.findByDomain(domain)
                .orElseGet(() -> new NewsSource(domain, "Unknown Source", "UNKNOWN", "Unknown", 
                        "This domain is not registered in our credibility database.", "SYSTEM"));
    }

    private String cleanDomain(String domain) {
        if (domain == null) return "";
        return domain.toLowerCase().trim().replaceAll("^(https?://)?(www\\.)?", "");
    }

    public String extractDomain(String urlOrDomain) {
        if (urlOrDomain == null || urlOrDomain.trim().isEmpty()) {
            return "";
        }
        String cleaned = urlOrDomain.trim().toLowerCase();
        if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
            cleaned = "https://" + cleaned;
        }
        try {
            URI uri = new URI(cleaned);
            String domain = uri.getHost();
            if (domain != null) {
                return domain.startsWith("www.") ? domain.substring(4) : domain;
            }
        } catch (URISyntaxException e) {
            // fallback
        }
        return cleanDomain(urlOrDomain);
    }
}
