package com.ke.serv.repository;

import com.ke.serv.entity.RestaurantEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer> {
    RestaurantEntity findById(int id);

    List<RestaurantEntity> findByNameContaining(String searchWord, PageRequest pageRequest);

    int countIdBy();
    int countIdByNameContaining(String searchWord);

    List<RestaurantEntity> findByNameContainingAndLocationContaining(String searchWord, String SearchTag, PageRequest of);

    List<RestaurantEntity> findByNameContainingAndCategoryOneContaining(String searchWord, String searchTag, PageRequest of);

    int countIdByNameContainingAndCategoryOneContaining(String searchWord, String searchTag);

    int countIdByNameContainingAndLocationContaining(String searchWord, String searchTag);


    @Query(value = "SELECT count(*) " +
            "FROM restaurant r " +
            "WHERE r.restaurant_name LIKE %:keyword% " +
            "AND r.category_1 IN :categories " +
            "AND SUBSTRING_INDEX(SUBSTRING_INDEX(r.location, '서울특별시 ', -1), ' ', 1) IN :locations",
            nativeQuery = true)
    int countRestaurants(@Param("keyword") String keyword,
                                     @Param("categories") List<String> categories,
                                     @Param("locations") List<String> locations);
    @Query(value = "SELECT count(*) " +
            "FROM restaurant r " +
            "WHERE r.restaurant_name LIKE %:keyword% " +
            "AND r.category_1 IN :categories",
            nativeQuery = true)
    int countRestaurantsByCat(@Param("keyword") String keyword,
                         @Param("categories") List<String> categories);
    @Query(value = "SELECT count(*) " +
            "FROM restaurant r " +
            "WHERE r.restaurant_name LIKE %:keyword% " +
            "AND SUBSTRING_INDEX(SUBSTRING_INDEX(r.location, '서울특별시 ', -1), ' ', 1) IN :locations",
            nativeQuery = true)
    int countRestaurantsByLoc(@Param("keyword") String keyword,
                              @Param("locations") List<String> locations);

    @Query(value = "SELECT * " +
            "FROM restaurant r " +
            "WHERE r.restaurant_name LIKE %:keyword% " +
            "AND r.category_1 IN :categories " +
            "AND SUBSTRING_INDEX(SUBSTRING_INDEX(r.location, '서울특별시 ', -1), ' ', 1) IN :locations ",
            nativeQuery = true)
    List<RestaurantEntity> findRestaurants(@Param("keyword") String keyword,
                                           @Param("categories") List<String> categories,
                                           @Param("locations") List<String> locations, PageRequest pageRequest);

    @Query(value = "SELECT * " +
            "FROM restaurant r " +
            "WHERE r.restaurant_name LIKE %:keyword% " +
            "AND r.category_1 IN :categories ",
            nativeQuery = true)
    List<RestaurantEntity> findRestaurantsByCat(@Param("keyword") String keyword,
                                                @Param("categories") List<String> categories, PageRequest pageRequest);

    @Query(value = "SELECT * " +
            "FROM restaurant r " +
            "WHERE r.restaurant_name LIKE %:keyword% " +
            "AND SUBSTRING_INDEX(SUBSTRING_INDEX(r.location, '서울특별시 ', -1), ' ', 1) IN :locations ",
            nativeQuery = true)
    List<RestaurantEntity> findRestaurantsByLoc(@Param("keyword") String keyword,
                                                @Param("locations") List<String> locations, PageRequest pageRequest);

    @Query(value = "SELECT rs.restaurant_no " +
            "FROM restaurant rs, review rv " +
            "WHERE rs.rating >= 3.5 " +
            "AND rv.restaurant_no = rs.restaurant_no " +
            "AND DATE_ADD(rv.writedate, INTERVAL 14 DAY) > NOW()",
            nativeQuery = true)
    List<Integer> findPopRestaurants();
}
