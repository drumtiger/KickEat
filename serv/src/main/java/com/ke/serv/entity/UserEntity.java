package com.ke.serv.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="USER")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // @JsonIgnoreProperties 어노테이션 추가!
public class UserEntity {

    @Id
    @Column(name="user_no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String userid;

    @Column(nullable = false)
    private String userpw;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email1;

    @Column(nullable = false)
    private String email2;

    @Column(nullable = false)
    private String tel1;

    @Column(nullable = false)
    private String tel2;

    @Column(nullable = false)
    private String tel3;

    @Column(nullable = false)
    private int zipcode;

    @Column(nullable = false)
    private String addr;

    private String addrdetail;

    //user_foods 추가
    @Column(nullable = true)
    private String foods;

}
