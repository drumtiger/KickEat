package com.ke.serv.repository;

import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewFileRepository extends JpaRepository<ReviewFileEntity, Integer> {
    List<ReviewFileEntity> findAllByReview(ReviewEntity re);
}
