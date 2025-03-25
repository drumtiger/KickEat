package com.ke.serv.repository;

import com.ke.serv.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {


    UserEntity findByUserid(String userid);
    UserEntity findByUseridAndUserpw(String userid, String userpw);
    UserEntity findById(int id);

    UserEntity findByIdAndUserpw(int id, String userpw);

    UserEntity findByUsernameAndEmail1AndEmail2(String username, String email1, String email2);

    UserEntity findByUseridAndEmail1AndEmail2(String userid, String email1, String email2);

}
