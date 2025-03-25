package com.ke.serv.controller;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HomeController {
    private final RestaurantService rest_service;

    @GetMapping("/")
    public String home(){
        return "index";
    }

    @GetMapping("/api")
    public String setAPI(){
        String result="";
        HashMap<String,Integer> h1 = new HashMap<String, Integer>(20);
        try{
            for(int i=0;i<500;i++) {
                URL url = new URL("http://openapi.seoul.go.kr:8088/59564b4578726a73353353466c4a6e/json/LOCALDATA_072404/"+Integer.toString(1000*i+1)+"/"+Integer.toString(1000*i+1000)+"/");
                BufferedReader bf = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
                result = bf.readLine();
                JSONParser jsonParser = new JSONParser();
                JSONObject jsonObject = (JSONObject) jsonParser.parse(result);
                JSONObject LOCALDATA_072404 = (JSONObject) jsonObject.get("LOCALDATA_072404");

                Long cnt = (Long) LOCALDATA_072404.get("list_total_count");
                JSONObject subResult = (JSONObject) LOCALDATA_072404.get("RESULT");
                JSONArray infoArr = (JSONArray) LOCALDATA_072404.get("row");
                System.out.println(infoArr.size());
                RestaurantEntity re = new RestaurantEntity();
                for (int j = 0; j < infoArr.size(); j++) {
                    //h1.put((String) ((JSONObject) infoArr.get(j)).get("UPTAENM"), 1); //업태
                    // ((JSONObject) infoArr.get(j)).get("TRDSTATENM"); //폐업여부
                    if(!((JSONObject) infoArr.get(j)).get("TRDSTATENM").equals("폐업")) {
                        re.setName((String)((JSONObject) infoArr.get(j)).get("BPLCNM"));
                        re.setLocation((String)((JSONObject) infoArr.get(j)).get("SITEWHLADDR"));
                        try {
                            re.setLatitudex(Float.parseFloat((String)((JSONObject) infoArr.get(j)).get("X")));
                            re.setLatitudey(Float.parseFloat((String)((JSONObject) infoArr.get(j)).get("Y")));
                            re.setArea(Float.parseFloat((String)((JSONObject) infoArr.get(j)).get("SITEAREA")));
                        } catch(Exception ee){
                            System.out.println("!");
                        }
                        String cat = (String) ((JSONObject) infoArr.get(j)).get("UPTAENM");
                        if(cat.contains("한식")||cat.contains("냉면집")||cat.contains("식육(숯불구이)")||cat.contains("횟집")||cat.contains("탕류")) {
                            re.setCategoryOne("한식");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("패스트푸드")||cat.contains("치킨")||cat.contains("피자")) {
                            re.setCategoryOne("패스트푸드");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("일식") || cat.contains("초밥")) {
                            re.setCategoryOne("일식");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("중국식")) {
                            re.setCategoryOne("중식");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("인도")||cat.contains("태국")) {
                            re.setCategoryOne("아시아음식");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("소주")||cat.contains("호프")||cat.contains("주점")) {
                            re.setCategoryOne("주점");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("김밥")||cat.contains("도시락")||cat.contains("분식")) {
                            re.setCategoryOne("분식");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("뷔페")) {
                            re.setCategoryOne("뷔페");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("패밀리")||cat.contains("레스토랑")) {
                            re.setCategoryOne("패밀리레스토랑");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.isEmpty() ||cat.contains("기타")) {
                            re.setCategoryOne("기타");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        else if(cat.contains("양식")) {
                            re.setCategoryOne("양식");
                            re.setCategoryTwo((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        }
                        re.setTel((String) ((JSONObject) infoArr.get(j)).get("SITETEL"));
                        re.setPostno((String) ((JSONObject) infoArr.get(j)).get("SITEPOSTNO"));
                        re.setId(i*1000+j+1);
                        rest_service.addRestaurantByAPI(re);
                    }
                }
            }

        } catch(Exception e) {
            e.printStackTrace();
        }
        return "hello!";
    }
}
