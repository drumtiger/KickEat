package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REVIEW_FILE")
public class ReviewFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_FILE_NO")
    private int id;

    @Column(nullable = false)
    private String filename;

    private int size;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "review_no")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ReviewEntity review;
}
