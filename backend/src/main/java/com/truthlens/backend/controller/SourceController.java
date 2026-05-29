package com.truthlens.backend.controller;

import com.truthlens.backend.model.NewsSource;
import com.truthlens.backend.service.SourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    private final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @GetMapping
    public ResponseEntity<List<NewsSource>> getAllSources() {
        return ResponseEntity.ok(sourceService.getAllSources());
    }

    @GetMapping("/verify")
    public ResponseEntity<NewsSource> verifySource(@RequestParam String url) {
        NewsSource source = sourceService.verifySource(url);
        return ResponseEntity.ok(source);
    }
}
