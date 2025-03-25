package com.ke.serv.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FreeBoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FREE_BOARD_ID")
    private int id;

    private String category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(columnDefinition = "int default 0")
    private int hit;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserEntity user;

    @JsonManagedReference
    @OneToMany(mappedBy = "freeBoard", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentEntity> comments;
}
