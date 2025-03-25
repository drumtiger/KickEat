package com.ke.serv.controller;

import com.ke.serv.entity.*;
import com.ke.serv.service.BoardService;
import com.ke.serv.service.RestaurantService;
import com.ke.serv.service.TechService;
import com.ke.serv.service.UserService;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tech")
@RequiredArgsConstructor
public class TechController {
    private final UserService service;
    private final BoardService board_service;
    private final RestaurantService rest_service;
    private final TechService tech_service;

    @GetMapping("/event")
    public List<EventEntity> event(@PageableDefault(sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return board_service.getEventByDate(EventEntity.BoardCategory.EVENT);
    }

    @GetMapping("/getUserInfo")
    public UserEntity getUserInfo(UserEntity entity) {
        return service.selectUser(entity);
    }

    @GetMapping("/jsoup")
    public HashMap infoSearch(String place_id) {

        System.setProperty("webdriver.chrome.driver","chromedriver.exe");

        ChromeOptions options=new ChromeOptions();
        options.addArguments("--disable-popup-blocking");//팝업 무시
        options.addArguments("headless");
        options.addArguments("--remote-allow-origins=*");
        WebDriver driver = new ChromeDriver(options);

        String[] category = new String[2];
        category[0] = "photoview";
        category[1] = "menuinfo";

        String url = "https://place.map.kakao.com/"+place_id;
        List<String> menu_list = new ArrayList<>();
        List<String> img_list = new ArrayList<>();
        List<String> info_list = new ArrayList<>();
        HashMap<String, List> map = new HashMap<>();
        try{
            driver.get(url);
            Thread.sleep(500);
            List<WebElement> buttons = driver.findElements(By.className("link_more"));
            List<WebElement> imgs = driver.findElements(By.className("img-thumb"));
            List<WebElement> when = driver.findElements(By.className("txt_detail"));
            System.out.println(when.size());
            for(WebElement wh : when) {
                if(!wh.getText().isEmpty()) info_list.add(wh.getText());
            }
            for(WebElement img : imgs) {
                img_list.add(img.getAttribute("src"));
            }
            System.out.println(imgs.size());
            for(WebElement button : buttons) {
                if(button.getText().contains("메뉴")) {
                    button.click();
                    break;
                }
            }
            List<WebElement> elements = driver.findElements(By.className("tit_item"));
            for(WebElement element : elements) {
                menu_list.add(element.getText());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        driver.quit();
        map.put("menu_list", menu_list);
        map.put("img_list", img_list);
        map.put("info_list",info_list);
        return map;
    }

    @PostMapping("/getWishState")
    public String getWishState(@RequestBody WishlistEntity entity) {
        WishlistEntity we = service.selectWishRestaurant(entity.getRestaurant(), entity.getUser());

        if (we == null) {
            return "♡";
        } else {
            return we.getState();
        }
    }

    @PostMapping("/wishlist")
    public WishlistEntity wishlist(@RequestBody WishlistEntity entity) {
        WishlistEntity we = service.selectWishRestaurant(entity.getRestaurant(), entity.getUser());

        if (entity.getState().equals("♡")) {
            entity.setState("♥");
        } else if (entity.getState().equals("♥")) {
            entity.setState("♡");
        }

        WishlistEntity updatedWishlist;
        if (we == null) {
            updatedWishlist = service.wishUpdate(entity);
        } else {
            we.setState(entity.getState());
            updatedWishlist = service.wishUpdate(we);
        }
        int cnt=0;
        List<WishlistEntity> wish_list = service.selectWishList(entity.getRestaurant());
        System.out.println(wish_list);
        for(WishlistEntity wish: wish_list) {
            if(wish.getState().equals("♥")) {
                cnt++;
            }
        }

        RestaurantEntity res_cnt = rest_service.restaurantSelect(entity.getRestaurant().getId());
        res_cnt.setWishCount(cnt);
        rest_service.addRestaurantByAPI(res_cnt);
        return updatedWishlist;
    }
    @PostMapping("/sendDm")
    public String sendDm(@RequestBody DmEntity entity){
        tech_service.insertDm(entity);
        return "ok";
    }
    @PostMapping("/getMessage")
    public List<DmEntity> getMessage(@RequestBody UserEntity user) {
        return tech_service.selectDmById(user);
    }
    @PostMapping("/getReport")
    public List<DmEntity> getReport(@RequestBody UserEntity user) {
        return tech_service.selectDmByReport(2);
    }
    @PostMapping("/readMessage")
    public List<DmEntity> readMessage(@RequestBody DmEntity dm) {
        DmEntity sel_dm = tech_service.selectDm(dm);
        sel_dm.setState(1);
        tech_service.insertDm(sel_dm);
        return tech_service.selectDmById(sel_dm.getUserTo());
    }
    @PostMapping("/deleteMessage")
    public List<DmEntity> deleteMessage(@RequestBody DmEntity dm) {
        DmEntity sel_dm = tech_service.selectDm(dm);
        UserEntity ue = sel_dm.getUserTo();
        tech_service.deleteMessageById(dm.getId());
        return tech_service.selectDmById(ue);
    }
    @PostMapping("/deleteReport")
    public List<DmEntity> deleteReport(@RequestBody DmEntity dm) {
        DmEntity sel_dm = tech_service.selectDm(dm);
        UserEntity ue = sel_dm.getUserTo();
        tech_service.deleteMessageById(dm.getId());
        return tech_service.selectDmByReport(2);
    }
    @PostMapping("/selUser")
    public UserEntity selUser(@RequestBody UserEntity entity) {
        return service.selectUser(entity);
    }
    /*
    @PostMapping("/getImg")
    public List<String> getImg(@RequestBody List<String> ids) {
        System.out.println(ids);
        System.setProperty("webdriver.chrome.driver","chromedriver.exe");

        ChromeOptions options=new ChromeOptions();
        options.addArguments("--disable-popup-blocking");//팝업 무시
        options.addArguments("headless");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-images");
        options.addArguments("--blink-settings=imagesEnabled=false");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        WebDriver driver = new ChromeDriver(options);
        List<String> res = new ArrayList<>();
        for(String place_id : ids) {
            String url = "https://place.map.kakao.com/"+place_id;
            try{
                driver.get(url);
                Thread.sleep(500);
                WebElement img = driver.findElement(By.className("img-thumb"));
                res.add(img.getAttribute("src"));
            } catch(Exception e) {
                res.add("");
            }
        }
        driver.quit();
        System.out.println(res.size());
        return res;
    }*/
}
