package com.truthlens.backend.controller;

import com.truthlens.backend.dto.NewsSourceDto;
import com.truthlens.backend.model.AdminLog;
import com.truthlens.backend.model.AnalysisReport;
import com.truthlens.backend.model.NewsSource;
import com.truthlens.backend.model.User;
import com.truthlens.backend.repository.AdminLogRepository;
import com.truthlens.backend.repository.AnalysisReportRepository;
import com.truthlens.backend.service.SourceService;
import com.truthlens.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final SourceService sourceService;
    private final AnalysisReportRepository reportRepository;
    private final AdminLogRepository adminLogRepository;

    public AdminController(UserService userService, SourceService sourceService,
                           AnalysisReportRepository reportRepository, AdminLogRepository adminLogRepository) {
        this.userService = userService;
        this.sourceService = sourceService;
        this.reportRepository = reportRepository;
        this.adminLogRepository = adminLogRepository;
    }

    private void logAdminAction(String adminName, String action, String details) {
        AdminLog log = new AdminLog(adminName, action, details);
        log.setCreatedAt(LocalDateTime.now());
        adminLogRepository.save(log);
    }

    // User management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id, Authentication authentication) {
        userService.deleteUser(id);
        logAdminAction(authentication.getName(), "DELETE_USER", "Deleted user with ID: " + id);
        return ResponseEntity.noContent().build();
    }

    // Source management
    @PostMapping("/sources")
    public ResponseEntity<NewsSource> addSource(@Valid @RequestBody NewsSourceDto dto, Authentication authentication) {
        NewsSource source = new NewsSource(
                dto.getDomain(),
                dto.getName(),
                dto.getStatus(),
                dto.getCategory(),
                dto.getDescription(),
                authentication.getName()
        );
        NewsSource saved = sourceService.addSource(source);
        logAdminAction(authentication.getName(), "ADD_SOURCE", "Added source: " + dto.getDomain() + " as " + dto.getStatus());
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/sources/{id}")
    public ResponseEntity<NewsSource> updateSource(@PathVariable String id, @Valid @RequestBody NewsSourceDto dto, Authentication authentication) {
        NewsSource source = new NewsSource(
                dto.getDomain(),
                dto.getName(),
                dto.getStatus(),
                dto.getCategory(),
                dto.getDescription(),
                authentication.getName()
        );
        NewsSource updated = sourceService.updateSource(id, source);
        logAdminAction(authentication.getName(), "UPDATE_SOURCE", "Updated source details for ID: " + id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/sources/{id}")
    public ResponseEntity<Void> deleteSource(@PathVariable String id, Authentication authentication) {
        sourceService.deleteSource(id);
        logAdminAction(authentication.getName(), "DELETE_SOURCE", "Deleted source record ID: " + id);
        return ResponseEntity.noContent().build();
    }

    // Admin Logs
    @GetMapping("/logs")
    public ResponseEntity<List<AdminLog>> getAdminLogs() {
        return ResponseEntity.ok(adminLogRepository.findAllByOrderByCreatedAtDesc());
    }

    // Dashboard Analytics
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getPlatformAnalytics() {
        List<User> users = userService.getAllUsers();
        List<AnalysisReport> reports = reportRepository.findAll();
        List<NewsSource> sources = sourceService.getAllSources();

        long adminCount = users.stream().filter(u -> "ROLE_ADMIN".equals(u.getRole())).count();
        long userCount = users.size() - adminCount;

        double avgCredibility = 0;
        long fakeNewsCount = 0;
        long clickbaitCount = 0;
        long toxicityCount = 0;

        if (!reports.isEmpty()) {
            double totalCredibility = 0;
            for (AnalysisReport r : reports) {
                totalCredibility += r.getCredibilityScore();
                if (r.getFakeProbability() > 50) {
                    fakeNewsCount++;
                }
                if (r.getClickbaitScore() > 50) {
                    clickbaitCount++;
                }
                if (r.getToxicityScore() > 50) {
                    toxicityCount++;
                }
            }
            avgCredibility = totalCredibility / reports.size();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("regularUsers", userCount);
        stats.put("adminUsers", adminCount);
        stats.put("totalReports", reports.size());
        stats.put("totalSources", sources.size());
        stats.put("avgCredibilityScore", Math.round(avgCredibility * 10.0) / 10.0);
        stats.put("fakeReportsDetected", fakeNewsCount);
        stats.put("clickbaitReportsDetected", clickbaitCount);
        stats.put("toxicReportsDetected", toxicityCount);

        return ResponseEntity.ok(stats);
    }
}
