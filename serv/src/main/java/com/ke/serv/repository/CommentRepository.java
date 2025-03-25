package com.ke.serv.repository;

import com.ke.serv.entity.CommentEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.WishlistEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    List<CommentEntity> findAllByFreeBoardId(int boardId);

    int countById(int id);

    int countIdByUser(UserEntity user);
    List<CommentEntity> findAllByUser(UserEntity entity, PageRequest of);

}
