package com.ke.serv.repository;

import com.ke.serv.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendRepository extends JpaRepository<RestaurantEntity, Integer> {
    @Query(value = "SELECT * " +
            "FROM restaurant r " +
            "WHERE r.category_1 = :category " +
            "AND r.location LIKE %:location% " +
            "ORDER BY RAND() " +
            "LIMIT 4",
            nativeQuery = true)
    List<RestaurantEntity> findByCategoryAndLocation(@Param("category") String category,
                                                     @Param("location") String location);

    @Query(value = "SELECT * " +
            "FROM restaurant r " +
            "WHERE r.location LIKE %:location% " +
            "AND r.category_1 IN :category",
            nativeQuery = true)
    List<RestaurantEntity> findRestByLocAndTag(@Param("category") List<String> a, @Param("location") String b);
}
