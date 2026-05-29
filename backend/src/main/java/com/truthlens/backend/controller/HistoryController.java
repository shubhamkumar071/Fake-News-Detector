package com.truthlens.backend.controller;

import com.truthlens.backend.model.AnalysisReport;
import com.truthlens.backend.model.User;
import com.truthlens.backend.service.AnalysisService;
import com.truthlens.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final AnalysisService analysisService;
    private final UserService userService;

    public HistoryController(AnalysisService analysisService, UserService userService) {
        this.analysisService = analysisService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AnalysisReport>> getHistory(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User details not found"));
        
        return ResponseEntity.ok(analysisService.getUserHistory(user.getId()));
    }
}
