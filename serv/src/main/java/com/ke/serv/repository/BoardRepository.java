// BoardRepository.java
package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // 추가
public interface BoardRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT COUNT(e) FROM EventEntity e WHERE (:category IS NULL OR e.category = :category)")
    int countByCategory(@Param("category") BoardCategory category);

    @Query(value = "SELECT e FROM EventEntity e WHERE e.category = :category",
            countQuery = "SELECT COUNT(e) FROM EventEntity e WHERE e.category = :category")
    Page<EventEntity> findByCategory(@Param("category") BoardCategory category, Pageable pageable);

    // BoardRepository.java 수정 (조회수 증가를 위한 쿼리 추가)
    @Modifying
    @Query("UPDATE EventEntity e SET e.hit = e.hit + 1 WHERE e.id = :id")
    void incrementHitCount(@Param("id") int id);

    // ✅✅✅ 검색 기능 쿼리 메소드 추가 (JPA 쿼리 메소드 활용) ✅✅✅
    @Query("SELECT e FROM EventEntity e WHERE e.category = :category AND (LOWER(e.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<EventEntity> findByCategoryAndSubjectContainingIgnoreCaseOrContentContainingIgnoreCase(
            @Param("category") BoardCategory category,
            @Param("keyword") String keyword,  // 파라미터 이름 통일
            Pageable pageable);

    Page<EventEntity> findByCategoryAndSubjectContainingIgnoreCase(
            @Param("category") BoardCategory category,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("SELECT e FROM EventEntity e JOIN e.user u WHERE e.category = :category AND LOWER(u.userid) LIKE LOWER(CONCAT('%', :useridKeyword, '%'))")
    Page<EventEntity> searchByCategoryAndUserId(
            @Param("category") EventEntity.BoardCategory category,
            @Param("useridKeyword") String useridKeyword,
            Pageable pageable);

    List<EventEntity> findAllByCategoryOrderByStartDateAsc(EventEntity.BoardCategory category);

    // findById 메서드 오버로딩 (Integer와 Long 타입 모두 처리)
    Optional<EventEntity> findById(Integer id); // 기존 메서드
    Optional<EventEntity> findById(Long id);  // Long 타입 ID를 위한 메서드
}