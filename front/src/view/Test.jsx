import { useEffect, useState } from "react";
import axios from "axios";

import '../css/page/about.css';
import Faded from '../effect/Faded'

const {kakao} = window;

function Test(){
    const [loc, setLoc] = useState('');
    const [rname, setRname] = useState('');

    const [searchAddress, SetSearchAddress] = useState();
    const [state, setState] = useState({
        // 지도의 초기 위치
        center: { lat: 37.49676871972202, lng: 127.02474726969814 },
        // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
        isPanto: true,
      });
// 키워드 입력후 검색 클릭 시 원하는 키워드의 주소로 이동
    const SearchMap = () => {
    const ps = new kakao.maps.services.Places()
    const placesSearchCB = function(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
        const newSearch = data[0]
        setState({
            center: { lat: newSearch.y, lng: newSearch.x }
        })
        }
    };
    ps.keywordSearch(`${searchAddress}`, placesSearchCB); 
    }
    useEffect(()=>{
        var where = new kakao.maps.LatLng(33.450701, 126.570667);
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = { 
            center: where, // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption); 
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);   
        var markerPosition  = where;

        var marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);
        console.log(markerPosition);
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
            // 클릭한 위도, 경도 정보를 가져옵니다 
            var latlng = mouseEvent.latLng; 
            
            // 마커 위치를 클릭한 위치로 옮깁니다
            marker.setPosition(latlng);
            map.setCenter(latlng);
            var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
            message += '경도는 ' + latlng.getLng() + ' 입니다';
            
            var resultDiv = document.getElementById('clickLatlng'); 
            resultDiv.innerHTML = message;
            
        });
    },[]);

    const testing = () => {
        let val = document.getElementById("testinput").value;
        axios.get('http://localhost:9977/test?val='+val)
        .then(res => {
            setLoc(res.data.location);
            setRname(res.data.name);
        })
        .catch(err => console.log(err));
    }
    return(
        <Faded>
            <div className="about-container">
            <div id="map" style={{width:'100%',height:'70vh',background:'beige'}}></div>
            <div id="clickLatlng"></div>
            <input type="text" id="testinput" readOnly/><button onClick={testing}>제출</button>
            <h4>{loc}</h4>
            <h5>{rname}</h5>
            </div>
        </Faded>
    )
}

export default Test;