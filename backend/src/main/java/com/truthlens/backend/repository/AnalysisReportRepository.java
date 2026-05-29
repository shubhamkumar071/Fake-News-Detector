package com.truthlens.backend.repository;

import com.truthlens.backend.model.AnalysisReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AnalysisReportRepository extends MongoRepository<AnalysisReport, String> {
    List<AnalysisReport> findByUserIdOrderByCreatedAtDesc(String userId);
    List<AnalysisReport> findFirst10ByOrderByCreatedAtDesc();
}
