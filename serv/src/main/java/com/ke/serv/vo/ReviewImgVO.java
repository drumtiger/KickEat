package com.ke.serv.vo;

import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewImgVO {
    private List<ReviewFileEntity> imgList;
    private ReviewEntity entity;
}
