package com.truthlens.backend.controller;

import com.truthlens.backend.dto.AnalysisRequest;
import com.truthlens.backend.model.AnalysisReport;
import com.truthlens.backend.model.User;
import com.truthlens.backend.service.AnalysisService;
import com.truthlens.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final UserService userService;

    public AnalysisController(AnalysisService analysisService, UserService userService) {
        this.analysisService = analysisService;
        this.userService = userService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisReport> analyze(
            @Valid @RequestBody AnalysisRequest request,
            Authentication authentication) {
        
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        AnalysisReport report = analysisService.runAnalysis(
                request.getText(),
                request.getUrl(),
                user.getId()
        );
        return ResponseEntity.ok(report);
    }

    @GetMapping("/report/{id}")
    public ResponseEntity<AnalysisReport> getReportDetails(@PathVariable String id) {
        AnalysisReport report = analysisService.getReportById(id)
                .orElseThrow(() -> new IllegalArgumentException("Analysis report not found with ID: " + id));
        return ResponseEntity.ok(report);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisReport>> getMyHistory(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        List<AnalysisReport> history = analysisService.getUserHistory(user.getId());
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/report/{id}")
    public ResponseEntity<Void> deleteMyReport(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        AnalysisReport report = analysisService.getReportById(id)
                .orElseThrow(() -> new IllegalArgumentException("Analysis report not found"));

        // Verify ownership
        if (!report.getUserId().equals(user.getId()) && !"ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).build();
        }

        analysisService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
