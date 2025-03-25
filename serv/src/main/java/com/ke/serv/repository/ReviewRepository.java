package com.ke.serv.repository;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.UserEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    List<ReviewEntity> findAllByRestaurantOrderByIdDesc(RestaurantEntity re);

    List<ReviewEntity> findAllByUser(UserEntity ue);

    ReviewEntity findById(int id);

    void deleteById(int id);

    List<ReviewEntity> findAllByUser(UserEntity entity, PageRequest of);

    List<ReviewEntity> findTop3ByOrderByRatingDesc();

    @Query(value = "SELECT * " +
            "FROM review rv " +
            "WHERE DATE_ADD(rv.writedate, INTERVAL 14 DAY) > NOW() " +
            "ORDER BY hit DESC LIMIT 3",
            nativeQuery = true)
    List<ReviewEntity> findPopReviews();

    int countIdByUser(UserEntity user);
}
