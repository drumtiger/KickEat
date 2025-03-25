package com.ke.serv.repository;

import com.ke.serv.entity.CommentEntity;
import com.ke.serv.entity.FreeBoardEntity;
import com.ke.serv.entity.UserEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FreeBoardRepository extends JpaRepository<FreeBoardEntity, Integer> {
    int countIdByCategory(String category);

    int countIdByCategoryAndTitleContaining(String category, String searchWord);

    List<FreeBoardEntity> findAllByCategoryOrderByIdDesc(String category, PageRequest of);

    List<FreeBoardEntity> findAllByCategoryAndTitleContainingOrderByIdDesc(String category, String searchWord, PageRequest of);

    FreeBoardEntity findById(int id);

    int countById(int id);

    @Query(value = "select * " +
            "from free_board_entity " +
            "where category='notice' " +
            "order by free_board_id desc",
            nativeQuery = true)
    List<FreeBoardEntity> noticeSelect();

    @Query("SELECT fb FROM FreeBoardEntity fb LEFT JOIN fb.comments c " +
            "GROUP BY fb.id ORDER BY COUNT(c.id) DESC")
    List<FreeBoardEntity> findAllByCommentCountDesc();

    List<FreeBoardEntity> findAllByOrderByHitDesc();

    int countIdByUser(UserEntity user);

    List<FreeBoardEntity> findAllByUser(UserEntity entity, PageRequest of);


}
