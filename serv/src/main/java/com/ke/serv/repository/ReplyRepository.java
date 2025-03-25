// ReplyRepository.java (새 리포지토리)

package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.ReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<ReplyEntity, Long> {
    List<ReplyEntity> findByEventOrderByCreateDateAsc(EventEntity event);


}
