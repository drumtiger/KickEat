package com.ke.serv.vo;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewFileEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
//
//    public RestaurantDTO(RestaurantEntity re, ReviewFileEntity e) {
//        this.id = re.getId();
//        this.name = re.getName();
//        this.location = re.getLocation();
//        this.hit = re.getHit();
//        this.categoryOne = re.getCategoryOne();
//        this.categoryTwo = re.getCategoryTwo();
//        this.rating = re.getRating();
//        this.review_count = 0;
//        this.review_file = e;
//    }

    private int id;

    private String rname;

    private int hit;

    private float rating;

    private int review_count;

    private int wish_count;

    private ReviewFileEntity review_file;
}
