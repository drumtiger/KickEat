package com.ke.serv.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMMENT_ID")
    private int id;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;

    @ManyToOne
    @JoinColumn(name = "FREE_BOARD_ID")
    @JsonBackReference
    private FreeBoardEntity freeBoard;

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserEntity user;
}
