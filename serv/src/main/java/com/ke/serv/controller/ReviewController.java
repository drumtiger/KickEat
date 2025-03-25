package com.ke.serv.controller;

import com.ke.serv.config.WebConfig;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.service.RestaurantService;
import com.ke.serv.service.ReviewService;
import com.ke.serv.vo.ReviewImgVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.sql.SQLException;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;
    private final RestaurantService rest_service;

    @GetMapping("/list")
    public List<ReviewImgVO> list(String restid){
        RestaurantEntity re = rest_service.restaurantSelect(Integer.parseInt(restid));
        List<ReviewEntity> review_list = service.selectReviewList(re);
        List<ReviewImgVO> result= new ArrayList<>();
        float rating = 0;
        float sum = 0;
        for(ReviewEntity review : review_list) {
            sum+=review.getRating();
            List<ReviewFileEntity> file_list = service.selectReviewFileList(review);
            ReviewImgVO rivo = new ReviewImgVO(file_list, review);
            result.add(rivo);
        }
        rating = sum/review_list.size();
        if(!review_list.isEmpty()) {
            re.setRating(rating);
            rest_service.addRestaurantByAPI(re);
        }
        return result;
    }

    @PostMapping("/write")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String write(ReviewEntity re, MultipartFile[] files, HttpServletRequest req) {
        List<File> file_list =null;
        System.out.println(re);

        try{
            ReviewEntity res_review = service.insert(re);
            file_list = new ArrayList<File>();
            for(MultipartFile mf: files) {
                String FILE_PATH = req.getServletContext().getRealPath("/uploads/review/")+res_review.getId();
                String orgFilename = mf.getOriginalFilename();
                System.out.println(orgFilename+"!");
                File f_folder = new File(FILE_PATH);
                if(!f_folder.exists()) f_folder.mkdirs();
                File f = new File(FILE_PATH, Objects.requireNonNull(orgFilename));
                int point = orgFilename.lastIndexOf(".");
                String fName = orgFilename.substring(0, point);
                String eName = orgFilename.substring(point + 1);
                if(f.exists()) {
                    for(int i=1;;i++) {
                        String newFilename = fName + "(" + i + ")." + eName;
                        File newFile = new File(FILE_PATH, newFilename);
                        if (!newFile.exists()) {
                            fName = fName + "(" + i + ")";
                            break;
                        }
                    }
                }
                File newFileObject = new File(FILE_PATH, fName + "." + eName);
                System.out.println(newFileObject);
                mf.transferTo(newFileObject);

                file_list.add(newFileObject);

                int size = (int) newFileObject.length();
                ReviewFileEntity rfe = new ReviewFileEntity(0,fName+"."+eName,size,res_review);
                ReviewFileEntity rfe_2 = service.fileInsert(rfe);
            }
            RestaurantEntity rest_entity = rest_service.restaurantSelect(re.getRestaurant().getId());
            List<ReviewEntity> review_list = service.selectReviewList(rest_entity);
            rest_entity.setReviewCount(review_list.size());
            rest_service.addRestaurantByAPI(rest_entity);
        } catch (Exception e) {
            e.printStackTrace();
            for (File delFile : file_list) {
                delFile.delete();
            }
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "fail";
        }

        return "ok";
    }
    @GetMapping("/getReviewById")
    public List<ReviewEntity> getReviewById(UserEntity entity) {
        return service.selectReviewListByUser(entity);
    }

    @GetMapping("/selectReview")
    public Map selectReview(ReviewEntity entity){
        Map map = new HashMap();
        ReviewEntity selected_review = service.selectReview(entity);
        selected_review.setHit(selected_review.getHit()+1);
        map.put("review", selected_review);
        service.insert(selected_review);
        map.put("img_list", service.selectReviewFileList(entity));
        return map;
    }
    @GetMapping("/deleteReview")
    public String deleteReview(ReviewEntity entity,HttpServletRequest req) {
        RestaurantEntity rest_entity = rest_service.restaurantSelect(service.selectReview(entity).getRestaurant().getId());
        List<ReviewFileEntity> rf_list = service.selectReviewFileList(entity);
        service.reviewDelete(entity);
        for(ReviewFileEntity rf : rf_list) {
            String FILE_PATH = req.getServletContext().getRealPath("/uploads/review/")+entity.getId();
            File file = new File(FILE_PATH, rf.getFilename());
            file.delete();
            File folder = new File(FILE_PATH,"");
            folder.delete();
        }
        float rating = 0;
        float sum = 0;
        List<ReviewEntity> review_list = service.selectReviewList(rest_entity);
        for(ReviewEntity re : review_list) sum+=re.getRating();
        rating = sum/review_list.size();
        if(!review_list.isEmpty()) {
            rest_entity.setRating(rating);
        }
        else {
            rest_entity.setRating(0);
        }
        rest_entity.setReviewCount(review_list.size());
        rest_service.addRestaurantByAPI(rest_entity);
        return "ok";
    }
}
