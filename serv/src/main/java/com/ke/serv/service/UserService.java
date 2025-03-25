package com.ke.serv.service;

import com.ke.serv.entity.*;
import com.ke.serv.repository.*;
import com.ke.serv.vo.PagingWishVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;
    private final WishRepository wishRepo;
    private final ReviewRepository reviewRepo;
    private final CommentRepository commentRepo;
    private final FreeBoardRepository freeBoardRepo;

    public UserEntity idEditChk(UserEntity entity){return  repo.findByUserid(entity.getUserid());}
    public UserEntity pwEditChk(UserEntity entity){return  repo.findByUseridAndUserpw(entity.getUserid(), entity.getUserpw());}

    public UserEntity signup(UserEntity entity) {
        return repo.save(entity);
    }

    public UserEntity idFind(UserEntity entity){
        return repo.findByUsernameAndEmail1AndEmail2(entity.getUsername(), entity.getEmail1(), entity.getEmail2());
    }
    public UserEntity pwFind(UserEntity entity){
        return repo.findByUseridAndEmail1AndEmail2(entity.getUserid(), entity.getEmail1(), entity.getEmail2());
    }

    public UserEntity idChk(UserEntity entity) {
        return repo.findByUserid(entity.getUserid());
    }
    public UserEntity pwChk(UserEntity entity) {
        return repo.findByUseridAndUserpw(entity.getUserid(), entity.getUserpw());
    }
    public UserEntity updateEdit(UserEntity entity){
        return repo.save(entity);
    }

    public UserEntity selectUser(UserEntity entity) {
        return repo.findById(entity.getId());
    }
    //wishlist 만들곳
    public WishlistEntity wishUpdate(WishlistEntity entity) {
        return wishRepo.save(entity);
    }

    public WishlistEntity selectWishRestaurant(RestaurantEntity re, UserEntity ue) {
        return wishRepo.findByRestaurantAndUser(re, ue);
    }

    public List<WishlistEntity> findWishList(UserEntity entity, PagingWishVO pwVO) {
        return wishRepo.findAllByUser(entity, PageRequest.of(pwVO.getNowPage() -1, pwVO.getOnePageRecord()));
    }

    public int totalRecord(UserEntity user) {
        return wishRepo.countIdByUser(user);
    }

    public List<WishlistEntity> graphData(UserEntity entity){
        return wishRepo.findAllByUser(entity);
    }

    public List<ReviewEntity> findReviewList(UserEntity entity, PagingWishVO prVO){
        return reviewRepo.findAllByUser(entity, PageRequest.of(prVO.getNowPage()-1,prVO.getOnePageRecord()));
    }

    public int totalReviewRecord(UserEntity user) {
        return reviewRepo.countIdByUser(user);
    }

    public List<WishlistEntity> selectWishList(RestaurantEntity re) {
       return wishRepo.findAllByRestaurant(re);
    }

    public int totalCommentRecord(UserEntity user){
        return commentRepo.countIdByUser(user);
    }

    public List<CommentEntity> findCommentList(UserEntity entity, PagingWishVO pcVO){
        return commentRepo.findAllByUser(entity, PageRequest.of(pcVO.getNowPage()-1, pcVO.getOnePageRecord()));
    }

    public int totalFreeBoardRecord(UserEntity user){
        return freeBoardRepo.countIdByUser(user);
    }

    public List<FreeBoardEntity> findFreeBoardList(UserEntity entity, PagingWishVO pfVO){
        return freeBoardRepo.findAllByUser(entity, PageRequest.of(pfVO.getNowPage()-1, pfVO.getOnePageRecord()));
    }

}
