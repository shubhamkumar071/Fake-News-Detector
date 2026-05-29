package com.truthlens.backend.repository;

import com.truthlens.backend.model.NewsSource;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface NewsSourceRepository extends MongoRepository<NewsSource, String> {
    Optional<NewsSource> findByDomain(String domain);
    boolean existsByDomain(String domain);
}
