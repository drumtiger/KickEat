package com.ke.serv.service;

import com.ke.serv.vo.PagingVO;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository repository;

    public List<RestaurantEntity> findListSelect(PagingVO pvo) {
        return repository.findByNameContaining(pvo.getSearchWord(), PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord(), Sort.by(Order.desc(pvo.getSort()))));
    }

    public List<RestaurantEntity> findListByTagLocation(PagingVO pvo){
        return repository.findByNameContainingAndLocationContaining(pvo.getSearchWord(), pvo.getSearchTag(), PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord()));
    }
    public List<RestaurantEntity> findListByTagCategory(PagingVO pvo){
        return repository.findByNameContainingAndCategoryOneContaining(pvo.getSearchWord(), pvo.getSearchTag(), PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord()));
    }

    public RestaurantEntity restaurantSelect(int id) {
        return repository.findById(id);
    }

    public void addRestaurantByAPI(RestaurantEntity re) {repository.save(re);}

    public int totalRecord(PagingVO pvo) {
        if (pvo.getSearchWord() == null || pvo.getSearchWord().isEmpty()){
            return repository.countIdBy();
        } else {
            return repository.countIdByNameContaining(pvo.getSearchWord());
        }
    }
    public int totalRecordByTag(PagingVO pvo,List<String> a, List<String> b) {
        if(pvo.getSearchWord().isEmpty()) {
            if(a.isEmpty()) {
                return repository.countRestaurantsByLoc("", b);
            }
            if(b.isEmpty()) {
                return repository.countRestaurantsByCat("", a);
            }
            return repository.countRestaurants("",a,b);
        }
        else {
            if(a.isEmpty()) {
                return repository.countRestaurantsByLoc(pvo.getSearchWord(), b);
            }
            if(b.isEmpty()) {
                return repository.countRestaurantsByCat(pvo.getSearchWord(), a);
            }
            return repository.countRestaurants(pvo.getSearchWord(),a,b);
        }
    }
    public List<RestaurantEntity> findListByTag(PagingVO pvo, List<String> a, List<String> b) {
        if(a.isEmpty()) {
            return repository.findRestaurantsByLoc(pvo.getSearchWord(), b,PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord(), Sort.by(Order.desc(pvo.getSort()))));
        }
        if(b.isEmpty()) {
            return repository.findRestaurantsByCat(pvo.getSearchWord(), a,PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord(), Sort.by(Order.desc(pvo.getSort()))));
        }
        return repository.findRestaurants(pvo.getSearchWord(),a,b,PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord(), Sort.by(Order.desc(pvo.getSort()))));
    }

    public void hitUpdate(RestaurantEntity entity) {
        repository.save(entity);
    }
    public List<Integer> popRestaurantSelect() {
        return repository.findPopRestaurants();
    }
}
