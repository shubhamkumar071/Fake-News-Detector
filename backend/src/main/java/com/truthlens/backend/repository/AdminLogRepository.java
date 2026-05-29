package com.truthlens.backend.repository;

import com.truthlens.backend.model.AdminLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AdminLogRepository extends MongoRepository<AdminLog, String> {
    List<AdminLog> findAllByOrderByCreatedAtDesc();
}
