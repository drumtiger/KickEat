import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import marker from '../../../img/marker.png';
import Review from './Review';
import ImageModal from './ImageModal';
import { useGlobalState } from '../../../GlobalStateContext';

const {kakao} = window;

function FindInfo() {
    const { serverIP } = useGlobalState();
    const loc = useLocation();
    const mount = useRef(true);
    const [info, setInfo] = useState({});
    const [tab, setTab] = useState('home');
    const [menu_list, setMenu_list] = useState([]);
    const [img_list, setImg_list] = useState([]);
    const [info_list, setInfo_list] = useState([]);
    const [imageModal, setImageModal] = useState(false);

    const [dist, setDist] = useState('');

    const [review_img_list,setReview_img_list] = useState([]);

    const [review_list, setReview_list] = useState([]);

    useEffect(()=>{
        if (!mount.current) {}
        else {
            mount.current = false;
            getInfo();
            getReview();
        }
    }, []);
    const getReview = () => {
        axios.get(`${serverIP}/review/list?restid=`+loc.state.id)
        .then(res => {
            setReview_list(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }
    useEffect(()=> {
        let x = [];
        review_list.forEach((item) => {
            item.imgList.forEach((imgs) => {
                x.push({filename:imgs.filename, id:imgs.review.id, writedate:imgs.review.writedate});
            })
        });
        setReview_img_list(x);
    },[review_list]);
    function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) {
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }
        var R = 6371;
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(lng2-lng1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d; 
      }
    useEffect(()=> {
        if (info.rstrLoc != undefined) {
            var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                mapOption = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                };  
    
            // 지도를 생성합니다    
            var map = new kakao.maps.Map(mapContainer, mapOption);
            
            var imageSrc = marker, // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(40, 40), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(20, 50)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                
            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
    
            var places = new kakao.maps.services.Places();
            
            var cb = (res, stat) => {
                res.forEach(item => {
                    let addr_list = item.address_name.split(' ');
                    let cnt = 0;
                    addr_list.forEach(a => {
                        if(info.rstrLoc.indexOf(a) !== -1) cnt++;
                    })
                    if(cnt >= addr_list.length-1 ) { //검색 점포명의 주소와 일치하는 카카오맵의 검색 결과
                        axios.get(`${serverIP}/tech/jsoup?place_id=`+item.id)
                        .then(res =>{
                            setMenu_list(res.data.menu_list);
                            setInfo_list(res.data.info_list);
                            setImg_list(res.data.img_list);
                        }).catch(err=>console.log(err))
                    }
                })
            }
            places.keywordSearch(info.rstrName,cb);

            // 주소-좌표 변환 객체를 생성합니다
            var geocoder = new kakao.maps.services.Geocoder();

            // 주소로 좌표를 검색합니다
            geocoder.addressSearch(info.rstrLoc, function(result, status) {
    
                // 정상적으로 검색이 완료됐으면 
                if (status === kakao.maps.services.Status.OK) {
    
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
                    if(sessionStorage.getItem("id") !== null && sessionStorage.getItem("id") != '') {
                        axios.get(`${serverIP}/tech/getUserInfo?id=`+sessionStorage.getItem("id"))
                        .then(res=>{
                            geocoder.addressSearch(res.data.addr , (ress, stat) => {
                                if(ress) {
                                    let x = ress[0].road_address.x;
                                    let y = ress[0].road_address.y;
                                    let ax = result[0].x;
                                    let ay = result[0].y;
                                    let dists = getDistanceFromLatLonInKm(x,y,ax,ay)*1000;
                                    if(dists/1000 > 0) dists = getDistanceFromLatLonInKm(x,y,ax,ay).toFixed(2)+'km';
                                    else dists= parseInt(dists)+'m';
                                    setDist(dists);
                                    return;
                                }
                            })
                        })
                        .catch(err => console.log(err));
                    }

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coords,
                        image: markerImage
                    });
    
                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    var infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:3px;font-size:0.9em;">
                                    ${info.rstrName}
                                </div>`
                    });
                    infowindow.open(map, marker);
    
                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    map.setCenter(coords);

                    // map.setDraggable(false);
                    map.setZoomable(false);
                    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
                } 
            }); 
        }
    },[info]);

    const getInfo = ()=> {
        axios.post(`${serverIP}/find/findInfo`, {id: loc.state.id})
        .then(res=>{
            setInfo({
                id: res.data.id,
                rstrName: res.data.name,
                rstrLoc: res.data.location
            })
            window.scrollTo({top:0,left:0,behavior:'smooth'});
        })
        .catch(err=>{
            console.log(err);
        });
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        appendDots: (dots) => (
          <div
            style={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ul> {dots} </ul>
          </div>
        ),
        dotsClass: 'dots_custom'
    };

    return (
        <div className='info'>
            {imageModal && <ImageModal setImageModal= {setImageModal} imageList={review_img_list} restaurant={info}/>}
            <h1>{info.rstrName}</h1>
            <div className='rPhoto'>
                <Slider {...settings}>
                {
                    img_list.length > 1 ? img_list.map((item, idx) => {
                        return(<div>
                            <img key={idx} src={item} style={{width:'100%', height:'30%'}}/>
                        </div>);
                    }) : review_img_list.length > 1 ? review_img_list.map((item, idx) => {
                        return (
                            idx < 5 && <div key={idx}>
                                <img src={`${serverIP}/uploads/review/${item.id}/${item.filename}`} 
                                    style={{ width: '100%', objectFit: 'contain', maxHeight: '420px' }} />
                            </div>
                        );
                    }) : <div>사진 정보가 없습니다.</div>
                }
                </Slider>
            </div>
            <div style={{textAlign:'center', fontSize:'30px'}}>🚶🏻‍♂️{dist}</div>

            <div className='rInfo'>
                <ul className='info-tab'>
                    <li onClick={()=>setTab("home")} style={tab == 'home' ? {color: '#b21848'} : {}}>정보</li>
                    <li onClick={()=>setTab("menu")} style={tab == 'menu' ? {color: '#b21848'} : {}}>메뉴</li>
                    <li onClick={()=>setTab("photo")} style={tab == 'photo' ? {color: '#b21848'}: {}}>사진</li>
                    <li onClick={()=>setTab("review")} style={tab == 'review' ? {color: '#b21848'} : {}}>리뷰</li>
                </ul>

                <div className='info-view'>
                    {tab === "home" && (
                        <div id="home">
                            {
                                info_list.length !== 0 ?
                                info_list.map((item,idx) => {
                                    return(<div key={idx}>
                                        {item}
                                    </div>);
                                }) : <div>상세정보가 없습니다.</div>
                            }
                        </div>
                    )}
                    {tab === "menu" && (
                        <div id="menu">
                            {
                                menu_list.length !== 0 ?
                                    menu_list.map((item,idx) => {
                                        return(<div key={idx} style={{textAlign: 'center'}}>
                                            {item}
                                        </div>);
                                    }) : <div>메뉴정보가 없습니다.</div>
                            }
                        </div>
                    )}
                    {tab === "photo" && (
                        <div id="photo">
                            {
                                review_img_list.length !== 0 ? 
                                    review_img_list.slice(0,4).map((item, idx) => {
                                        if (idx === 3 || idx === review_img_list.length - 1) {
                                            return <div>
                                                        <img id="moreImage" key={idx} src={`${serverIP}/uploads/review/${item.id}/${item.filename}`} 
                                                            onClick={()=>setImageModal(true)}/>
                                                        <div id="moreText">더보기</div>
                                                    </div>
                                        } else {
                                            return <img key={idx} src={`${serverIP}/uploads/review/${item.id}/${item.filename}`} />;
                                        }
                                    }) 
                                    : <div style={{width: '170px', padding: '5px 0'}}>등록된 사진이 없습니다.</div>
                            }
                        </div>
                    )}
                    {(tab === "review") ? 
                        <Review getReview={getReview} review_list={review_list} restaurant_id={loc.state.id} isLogin={ sessionStorage.getItem("loginStatus") === 'Y' ? true : false}/> : <></>
                    }
                </div>
                
            </div>
            
            <div className='rLocation'>
                오시는 길
                <div id='map'></div>
            </div>
        </div>
    )
}

export default FindInfo;