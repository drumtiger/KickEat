package com.ke.serv.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {
    private final RecommendService service;

    @GetMapping("/list")
    public List<RestaurantEntity> list(String menuCategory, String address) {
        System.out.println(menuCategory);
        System.out.println(address);
        String[] categories = menuCategory.split("/");
        List<String> dbCategory = new ArrayList<>();
        for(String category : categories) {
            switch (category) {
                case "asia":
                    dbCategory.add("아시아음식");
                    break;
                case "buffet":
                    dbCategory.add("뷔페");
                    break;
                case "bunsik":
                    dbCategory.add("분식");
                    break;
                case "china":
                    dbCategory.add("중식");
                    break;
                case "fastfood":
                    dbCategory.add("패스트푸드");
                    break;
                case "hansik":
                    dbCategory.add("한식");
                    break;
                case "japan":
                    dbCategory.add("일식");
                    break;
                case "joojeom":
                    dbCategory.add("주점");
                    break;
                case "western":
                    dbCategory.add("양식");
                    break;
                default:
                    // 해당 카테고리가 없으면 아무것도 하지 않음
                    break;
            }
        }
        List<RestaurantEntity> restaurants = service.findListByTag(dbCategory, address);

        return restaurants;
    }
}
