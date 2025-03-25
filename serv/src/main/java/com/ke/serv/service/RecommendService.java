package com.ke.serv.service;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.repository.RecommendRepository;
import com.ke.serv.vo.PagingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final RecommendRepository repository;

    public List<RestaurantEntity> findByCategoryAndLocation(String category, String location) {
        return repository.findByCategoryAndLocation(category, location);
    }

    public List<RestaurantEntity> findListByTag(List<String> a, String b) {
        return repository.findRestByLocAndTag(a,b);
    }
}
