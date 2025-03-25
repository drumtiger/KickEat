package com.ke.serv.controller;

import com.ke.serv.entity.*;
import com.ke.serv.service.FreeBoardService;
import com.ke.serv.service.RestaurantService;
import com.ke.serv.service.UserService;
import com.ke.serv.vo.PagingWishVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    private final RestaurantService rest_sevice;
    private final FreeBoardService free_sevice;
    @PostMapping("/signup")
    public String signup(@RequestBody UserEntity entity) {
        System.out.println(entity.toString()+"asdjfhnbalkjvbejkbaskjvbe");
        return "ok";
    }

    @PostMapping("/getWishList")
    public Map getWishList(UserEntity entity, PagingWishVO pwVO, @PageableDefault(sort="id", direction = Sort.Direction.DESC) Pageable pageable){
        pwVO.setTotalRecord(service.totalRecord(entity));
        List<WishlistEntity> we = service.findWishList(entity, pwVO); // 여기를 페이징
        List<RestaurantEntity> re = new ArrayList<>();
        for(WishlistEntity wish : we) {
            re.add(rest_sevice.restaurantSelect(wish.getRestaurant().getId()));
        }
        Map map = new HashMap();
        map.put("pwVO",pwVO);
        map.put("re", re);
        map.put("we", we);
        return map;
    }

    @PostMapping("/getReviewList")
    public Map getReviewList(UserEntity entity, PagingWishVO prVO, @PageableDefault(sort="id", direction =  Sort.Direction.DESC) Pageable pageable){
        prVO.setTotalRecord(service.totalReviewRecord(entity));
        List<ReviewEntity> review = service.findReviewList(entity, prVO);
        List<RestaurantEntity> rest = new ArrayList<>();
        for(ReviewEntity reviewEntity : review) {
            rest.add(rest_sevice.restaurantSelect(reviewEntity.getRestaurant().getId()));
        }
            Map map = new HashMap();
            map.put("prVO",prVO);
            map.put("rest",rest);
            map.put("review",review);
            return map;
        }
    @PostMapping("/getCommentList")
    public Map getCommentList(UserEntity entity, PagingWishVO pcVO, @PageableDefault(sort="id", direction =  Sort.Direction.DESC) Pageable pageable){
        pcVO.setTotalRecord(service.totalCommentRecord(entity));
        List<CommentEntity> comment = service.findCommentList(entity, pcVO);

        List<FreeBoardEntity> free = new ArrayList<>();
        for(CommentEntity commentEntity : comment) {
            free.add(free_sevice.freeBoardSelect(commentEntity.getFreeBoard().getId()));
        }

        Map map = new HashMap();
        map.put("pcVO",pcVO);
        map.put("free",free);
        map.put("comment", comment);
        return map;
    }
    @PostMapping("/getFreeBoardList")
    public Map getFreeBoardList(UserEntity entity, PagingWishVO pfVO, @PageableDefault(sort="id", direction =  Sort.Direction.DESC) Pageable pageable){
        pfVO.setTotalRecord(service.totalFreeBoardRecord(entity));
        List<FreeBoardEntity> freeBoard = service.findFreeBoardList(entity, pfVO);
        Map map = new HashMap();
        map.put("pfVO",pfVO);
        map.put("freeBoard",freeBoard);
        return map;
    }


    @GetMapping("/graphData")
    public List<RestaurantEntity> getGraphData(UserEntity entity){
        List<WishlistEntity> we = service.graphData(entity);
        List<RestaurantEntity> redata = new ArrayList<>();
        for(WishlistEntity wish : we){
            redata.add(rest_sevice.restaurantSelect(wish.getRestaurant().getId()));
        }
        return redata;

    }


    @PostMapping("/editEnterChk")
    public UserEntity editEnterChk(@RequestBody UserEntity entity){
        System.out.println(entity);
        UserEntity ue = new UserEntity();
        if(service.idEditChk(entity) == null){
            ue.setId(-1);
            return ue;
        }
        if(service.pwEditChk(entity)==null){
            ue.setId(-2);
            return ue;
        }

        return service.idEditChk(entity);
    }


    @PostMapping("/idChk")
    public String idChk(@RequestBody UserEntity entity) {
        if(service.idChk(entity) == null) return "0";
        return "1";
    }

    @PostMapping("/loginChk")
    public UserEntity loginchk(@RequestBody UserEntity entity) {
        UserEntity ue = new UserEntity();
        if(service.idChk(entity) == null) {
            ue.setId(-1);
            return ue;
        }
        if(service.pwChk(entity) == null) {
            ue.setId(-2);
            return ue;
        }
        return service.idChk(entity);
    }

    @PostMapping("/checkList")
    public String checkList(@RequestBody UserEntity entity) {
        System.out.println(service.signup(entity));
       return "foodsupdate ok";
    }

    @PostMapping("/editcheckList")
    public String eidtcheckList(@RequestBody UserEntity entity) {
        System.out.println(entity);
        UserEntity result = service.updateEdit(entity);

        if(result==null){
            return "editFail";
        }
        return "editupdate ok";
    }
    @PostMapping("/idFind")
    public UserEntity idFind(@RequestBody UserEntity entity){
        UserEntity ue = new UserEntity();
        if(service.idFind(entity) == null){
            ue.setId(-1);
        }
        return service.idFind(entity);

    }
    @PostMapping("/pwFind")
    public UserEntity pwFind(@RequestBody UserEntity entity){
        UserEntity ue = new UserEntity();
        if(service.pwFind(entity) == null){
            ue.setId(-1);
        }
        return service.pwFind(entity);

    }
}