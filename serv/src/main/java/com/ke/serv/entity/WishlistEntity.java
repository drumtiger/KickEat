package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name ="WISHLIST")
public class WishlistEntity {
    @Id
    @Column(name = "wishlist_no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "RESTAURANT_NO")
    private RestaurantEntity restaurant;

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserEntity user;

    private String state;
}
