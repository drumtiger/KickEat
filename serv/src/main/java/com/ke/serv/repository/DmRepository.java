package com.ke.serv.repository;


import com.ke.serv.entity.DmEntity;
import com.ke.serv.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DmRepository extends JpaRepository<DmEntity, Integer> {
    DmEntity findById(int id);

    List<DmEntity> findAllByUserToOrderByIdDesc(UserEntity user);

    List<DmEntity> findAllByState(int i);
}
