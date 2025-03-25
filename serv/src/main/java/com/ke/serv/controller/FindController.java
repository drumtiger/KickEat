package com.ke.serv.controller;

import com.ke.serv.entity.FreeBoardEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import com.ke.serv.service.FreeBoardService;
import com.ke.serv.service.ReviewService;
import com.ke.serv.vo.PagingVO;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RestaurantService;
import com.ke.serv.vo.RestaurantDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/find")
@RequiredArgsConstructor
public class FindController {
    private final RestaurantService service;
    private final ReviewService review_service;
    private final FreeBoardService free_service;

    @PostMapping("/searchList")
    public Map searchList(@RequestBody PagingVO pvo) {

        List<RestaurantEntity> list = new ArrayList<>();
        if(pvo.getSearchTag().isEmpty()) {
            if (pvo.getSort().equals("restaurant_no")) pvo.setSort("id");
            else if(pvo.getSort().equals("wish_count")) pvo.setSort("wishCount");
            else if (pvo.getSort().equals("review_count")) pvo.setSort("reviewCount");
            pvo.setTotalRecord(service.totalRecord(pvo));
            list = service.findListSelect(pvo);
        }
        else {
            String[] tagList = pvo.getSearchTag().split("#");
            List<String> loc_list = new ArrayList<>();
            List<String> cat_list = new ArrayList<>();
            for(int i=1;i< tagList.length;i++) {
                if(tagList[i].contains("구")) loc_list.add(tagList[i].replace(" ", ""));
                else cat_list.add(tagList[i].replace(" ", ""));
            }
            System.out.println(service.totalRecordByTag(pvo,cat_list,loc_list)+"!!");
            pvo.setTotalRecord(service.totalRecordByTag(pvo,cat_list,loc_list));
            list = service.findListByTag(pvo,cat_list,loc_list);
        }
        Map map = new HashMap();
        map.put("pvo", pvo);
        map.put("list", list);
        System.out.println(pvo.getOnePageRecord());
        return map;
    }

    @PostMapping("/findInfo")
    public RestaurantEntity getInfo(@RequestBody RestaurantEntity entity) {
        RestaurantEntity updatedEntity = service.restaurantSelect(entity.getId());

        updatedEntity.setHit(updatedEntity.getHit() + 1); // 조회수 증가
        service.hitUpdate(updatedEntity);

        return service.restaurantSelect(updatedEntity.getId());
    }

    @GetMapping("/getPopRestaurant")
    public List<RestaurantDTO> getPopRestaurant() {
        List<Integer> list = service.popRestaurantSelect();
        Map<Integer, Integer> map = new HashMap<>();
        for(Integer id: list) {
            if(map.containsKey(id)) {
                map.put(id, map.get(id)+1);
            } else {
               map.put(id,1);
            }
        }

        List<RestaurantDTO> dtoList = new ArrayList<>();
        for (Integer id: map.keySet()) {
            RestaurantDTO dto = new RestaurantDTO();
            RestaurantEntity re = service.restaurantSelect(id);

            dto.setId(id);
            dto.setRname(re.getName());
            dto.setHit(re.getHit());
            dto.setRating(re.getRating());
            dto.setReview_count(map.get(id));
            dto.setReview_file(review_service.selectReviewFileList(review_service.selectReviewList(re).get(0)).get(0));
            dto.setWish_count(re.getWishCount());
            dtoList.add(dto);
        }
        dtoList.sort(Comparator.comparing(RestaurantDTO::getReview_count)
                .thenComparing(RestaurantDTO::getRating).reversed());

        List<RestaurantDTO> topThreeList = new ArrayList<>();

        for (int i = 0; i < dtoList.size(); i++) {
            if (i == 3) break;
            topThreeList.add(dtoList.get(i));
        }

        return topThreeList;
    }

    @GetMapping("/getPopReview")
    public Map getPopReview() {

        List<ReviewEntity> review_list = review_service.popReviewSelect();
        List<ReviewFileEntity> file_list = new ArrayList<>();

        for (ReviewEntity re : review_list) {
            file_list.add(review_service.selectReviewFileList(re).get(0));
        }
        Map map = new HashMap();
        map.put("review_list", review_list);
        map.put("file_list", file_list);

        return map;
    }
    @GetMapping("/getPopBoard")
    public List<FreeBoardEntity> getPopBoard(String sort){
        System.out.println(sort);
        if(sort.equals("hit")) return free_service.getBoardOrderByHit();
        return free_service.getBoardsOrderedByCommentCount();
    }
}
