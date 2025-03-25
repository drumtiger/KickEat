package com.ke.serv.repository;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.WishlistEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WishRepository extends JpaRepository<WishlistEntity, Integer> {
    WishlistEntity findByRestaurantAndUser(RestaurantEntity re, UserEntity ue);

    List<WishlistEntity> findAllByUser(UserEntity entity, PageRequest of);
    List<WishlistEntity> findAllByUser(UserEntity entity);
    List<WishlistEntity> findAllByRestaurant(RestaurantEntity re);

    int countIdByUser(UserEntity user);
}
