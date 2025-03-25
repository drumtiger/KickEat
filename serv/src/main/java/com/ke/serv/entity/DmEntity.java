package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name ="DM")
public class DmEntity {
    @Id
    @Column(name = "dm_no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "from_no")
    private UserEntity userFrom;

    @ManyToOne
    @JoinColumn(name = "to_no")
    private UserEntity userTo;

    @Column(columnDefinition = "int default 0")
    private int state;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;

    private String comment;
}
