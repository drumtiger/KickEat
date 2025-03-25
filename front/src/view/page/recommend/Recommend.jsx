import { act, useEffect, useState } from 'react';
import '../../../css/page/recommend/recommend.css';
import Faded from '../../../effect/Faded';
import activatedLogo from '../../../img/kickeat_logo.png';
import disabledLogo from '../../../img/kickeat_logo_disabled.png';
import emptyImage from '../../../img/empty_select_menu.png';
import searchIcon from '../../../img/search.png';
import refreshIcon from '../../../img/refresh.png';
import questionMarkIcon from '../../../img/questionMarkIcon.png';
import Post from '../../user/Post';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../GlobalStateContext';

const { kakao } = window;


function Recommend() {
    const { serverIP } = useGlobalState();
    var menuCategory = ["asia", "buffet", "bunsik", "china", "fastfood", "hansik", "japan", "joojeom", "western"];
    const [menuArr, setMenuArr] = useState(new Array(menuCategory.length).fill([]).map(() => [0, 1, 2, 3, 4]));
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [lastestSelectedMenu, setLastestSelectedMenu] = useState("");

    const [left_hover, setLeft_hover] = useState(false);
    const [right_hover, setRight_hover] = useState(false);

    const [dist_one, setDist_one] = useState(0);
    const [dist_two, setDist_two] = useState(0);
    const [dist_three, setDist_three] = useState(0);
    const [dist_four, setDist_four] = useState(0);

    const [rest_info, setRest_info] = useState({
        id: 0,
        name: '',
        location: '',
        distance: 0,
        rating: 0,
        wish: 0,
        hit: 0,
        category: 0,
        review: 0
    });
    const [rest_info_two, setRest_info_two] = useState({
        id: 0,
        name: '',
        location: '',
        distance: 0,
        rating: 0,
        wish: 0,
        hit: 0,
        category: 0,
        review: 0
    });
    const [rest_info_three, setRest_info_three] = useState({
        id: 0,
        name: '',
        location: '',
        distance: 0,
        rating: 0,
        wish: 0,
        hit: 0,
        category: 0,
        review: 0
    });
    const [rest_info_four, setRest_info_four] = useState({
        id: 0,
        name: '',
        location: '',
        distance: 0,
        rating: 0,
        wish: 0,
        hit: 0,
        category: 0,
        review: 0
    });

    const { pageMove, setPageMove } = useGlobalState();

    useEffect(() => {
        setPageMove(!pageMove);
        axios.get(`${serverIP}/tech/getUserInfo?id=` + sessionStorage.getItem('id'))
            .then(res => {
                setAddr({ address: res.data.addr });
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        var imagePath = '/img/recommend/menuCategory/';
        var imageExt = '.jpg';

        var result = getRandomMenu();

        setMenuImage((prev) => ({
            // 새로운 메뉴 이미지로 변경
            leftImage: imagePath + result[0] + '_' + result[1] + imageExt,
            rightImage: imagePath + result[2] + '_' + result[3] + imageExt
        }));
    }, [menuArr]);

    function getRandomMenu() {
        // 중복되지 않는 카테고리 먼저 선택
        const uniqueMenuNumber = new Set();

        while (uniqueMenuNumber.size < 2) {
            const randomNumber = Math.floor(Math.random() * menuCategory.length);
            // 선택된 숫자의 menuArr 배열의 값이 전부 -1이 아닌지 검사
            let minusCount = 0;
            for (let i = 0; i < menuArr[randomNumber].length; i++) {
                if (menuArr[randomNumber][i] == -1) {
                    minusCount++;
                }
            }

            // 전부 -1이 아닌 경우 추가
            if (minusCount != 5) {
                uniqueMenuNumber.add(randomNumber);
            }
        }

        // 결과 배열로 변환
        const uniqueMenuNumberArr = Array.from(uniqueMenuNumber);

        const uniqueNumber = new Array();

        while (uniqueNumber.length < 2) {

            if (uniqueNumber.length == 0) {
                var randomIndex1 = Math.floor(Math.random() * menuArr[uniqueMenuNumberArr[0]].length);
                if (menuArr[uniqueMenuNumberArr[0]][randomIndex1] !== -1) {
                    uniqueNumber.push(randomIndex1);
                }
            }

            if (uniqueNumber.length == 1) {
                var randomIndex2 = Math.floor(Math.random() * menuArr[uniqueMenuNumberArr[1]].length);
                if (menuArr[uniqueMenuNumberArr[1]][randomIndex2] !== -1) {
                    uniqueNumber.push(randomIndex2);
                }
            }
        }

        return [menuCategory[uniqueMenuNumberArr[0]], uniqueNumber[0], menuCategory[uniqueMenuNumberArr[1]], uniqueNumber[1]];
    }

    function exceptMenu(menuCategoryName, menuNumber) {
        var menuCategoryNumber = menuCategory.indexOf(menuCategoryName);

        setMenuArr(prev => {
            const updatedMenuArr = [...prev];
            updatedMenuArr[menuCategoryNumber] = [...prev[menuCategoryNumber]];
            updatedMenuArr[menuCategoryNumber][menuNumber] = -1;

            return updatedMenuArr;
        });
    }

    const [menuImage, setMenuImage] = useState({
        leftImage: null,
        rightImage: null
    });

    const [isListPrinted, setIsListPrinted] = useState(false);
    const [isMenuSelected, setIsMenuSelected] = useState([false, false, false, false]);

    useEffect(() => {
        for (let i = 0; i < isMenuSelected.length; i++) {
            var logo = disabledLogo;
            if (isMenuSelected[i]) {
                logo = activatedLogo;
                break;
            }
        }
        document.getElementById('kickEatListButton').style.backgroundImage = `url(${logo})`;
    }, [isMenuSelected])


    const countSelectedMenu = () => {
        let selectedMenuCnt = 0;

        for (let i = 1; i <= 4; i++) {
            if (isMenuSelected[i - 1]) {
                selectedMenuCnt++;
            }
        }

        return selectedMenuCnt;
    }

    const countExceptMenu = () => {

        let exceptMenuCnt = 0;

        for (let i = 0; i < menuArr.length; i++) {
            for (let j = 0; j < menuArr[i].length; j++) {
                if (menuArr[i][j] == -1) {
                    exceptMenuCnt++;
                }
            }
        }

        return exceptMenuCnt;
    }

    const kickMenu = (option) => {
        if (countExceptMenu() == 42) {
            alert("표시할 메뉴가 부족합니다.");
            window.location.reload();
            return;
        }

        if (countSelectedMenu() == 4) {
            return;
        }

        for (let i = 1; i <= 4; i++) {

            if (!isMenuSelected[i - 1]) {
                if (option === 'left') {

                    var fileName = menuImage.leftImage.substring(28, menuImage.leftImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    break;
                } else if (option === 'right') {

                    var fileName = menuImage.rightImage.substring(28, menuImage.rightImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    break;
                }
            }
        }
    }
    const selectMenu = (option) => {
        if (countExceptMenu() == 42) {
            alert("표시할 메뉴가 부족합니다.");
            window.location.reload();
            return;
        }

        if (countSelectedMenu() == 4) {
            return;
        }

        for (let i = 1; i <= 4; i++) {

            if (!isMenuSelected[i - 1]) {
                if (option === 'left') {
                    document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 1s ease-in-out';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 0;

                    var fileName = menuImage.leftImage.substring(28, menuImage.leftImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    setIsMenuSelected((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = true;
                        return newState;
                    });

                    setSelectedMenu((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = menuName;
                        return newState;
                    });

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").src = menuImage.leftImage;
                        document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                    }, 750);

                    setTimeout(() => {
                        if(document.getElementById("select-menu" + i))
                        document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 0s ease-in-out';
                    }, 1500);
                    break;
                } else if (option === 'right') {
                    if(document.getElementById("select-menu" + i)){
                    document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 1s ease-in-out';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 0;
                    }

                    var fileName = menuImage.rightImage.substring(28, menuImage.rightImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    setIsMenuSelected((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = true;
                        return newState;
                    })

                    setSelectedMenu((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = menuName;
                        return newState;
                    });

                    setTimeout(() => {
                        if(document.getElementById("select-menu" + i)) {
                            document.getElementById("select-menu" + i).querySelector("img").src = menuImage.rightImage;
                            document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                        }
                    }, 750);

                    setTimeout(() => {
                        if(document.getElementById("select-menu" + i)){
                            document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 0s ease-in-out';
                        }
                    }, 1500);
                    break;
                }
            }
        }

        var imagePath = '/img/recommend/menuCategory/';
        var imageExt = '.png';

        var result = getRandomMenu();

        setMenuImage((prev) => ({
            // 새로운 메뉴 이미지로 변경
            leftImage: imagePath + result[0] + result[1] + imageExt,
            rightImage: imagePath + result[2] + result[3] + imageExt
        }));
    }

    const showRecommendList = () => {
        if (sessionStorage.getItem("loginStatus") != "Y") {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!document.getElementById("kickEatListButton").style.backgroundImage.includes("disable")) {
            var recommnedContainer = document.getElementsByClassName("recommend-container")[0];
            let menuCon = document.getElementsByClassName('menu-container')[0];
            menuCon.style.transition = 'all 2s';
            menuCon.style.transform = 'translateY(-700px)';
            let selCon = document.getElementsByClassName('select-menu-container')[0];
            selCon.style.transition = 'all 2s';
            selCon.style.transform = 'translateY(-700px)';
            selCon.style.height = '0px';
            recommnedContainer = document.getElementsByClassName("recommend-container")[0];
            recommnedContainer.style.transition = 'all 1.5s';
            recommnedContainer.style.paddingTop = '75px';
            recommnedContainer.style.height = '0px';
            let recCon = document.getElementById('recommend-list');
            recCon.style.height = '850px';


            for (let i = 1; i <= 4; i++) {
                if (i == 1) {
                    setLastestSelectedMenu(selectedMenu[0]);
                }
                if (document.getElementById("select-menu" + i).querySelector("button")) {
                    document.getElementById("select-menu" + i).querySelector("button").remove();
                }
            }
            setIsListPrinted(true);
        }
    }

    const postButtonStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '30px',
        height: '30px',
        fontSize: '20px'
    }

    const postBox = {
        backgroundColor: 'white',
        width: '800px',
        height: '450px',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-45%)',
        border: '2px solid black',
        borderRadius: '5px'
    }

    const [popup, setPopup] = useState(false);
    const [addr, setAddr] = useState({ addr: '' });
    const handleComplete = (data) => {
        setPopup(!popup);
    }
    const calcDist = (addrs, iddx) => {
        let dists = 0;
        var geocoder = new kakao.maps.services.Geocoder();

        if (addr.address != undefined)
            geocoder.addressSearch(addrs, function (result, status) {

                if (status === kakao.maps.services.Status.OK) {
                    geocoder.addressSearch(addr.address, (ress, stat) => {
                        if (ress) {
                            let x = ress[0].road_address.x;
                            let y = ress[0].road_address.y;
                            let ax = result[0].x;
                            let ay = result[0].y;
                            dists = getDistanceFromLatLonInKm(x, y, ax, ay) * 1000;
                            if (dists / 1000 > 0) dists = getDistanceFromLatLonInKm(x, y, ax, ay).toFixed(2) + 'km';
                            else dists = parseInt(dists) + 'm';
                            if (iddx === 1) setDist_one(dists);
                            else if (iddx === 2) setDist_two(dists);
                            else if (iddx === 3) setDist_three(dists);
                            else setDist_four(dists);
                            return;
                        }
                    })
                }
            });
    }


    useEffect(() => {
        if (addr.address != undefined) {
            reqeustToServer();
        }
    }, [lastestSelectedMenu]);

    const [recommendResultId, setRecommendResultId] = useState([]);
    const [selectedRecommendId, setSelectedRecommendId] = useState(0);
    const navigate = useNavigate();

    function onClickDetail(id) {
        navigate('/findInfo', { state: { id: id } })
    }
    function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        var R = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lng2 - lng1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    function reqeustToServer() {
        // 정규 표현식으로 구 추출
        const regex = /([가-힣]+구)/;

        const trimAddress = addr.address.match(regex) ? addr.address.match(regex)[0] : null;

        let x = '';

        for (var i = 0; i < selectedMenu.length; i++) x += selectedMenu[i] + '/';

        axios.get(`${serverIP}/recommend/list?menuCategory=` + x + '&address=' + trimAddress)
            .then(function (response) {
                let z = parseInt(Math.random() * response.data.length);
                if (z >= response.data.length - 4) z -= 4;
                let idd = 1;
                for (let i = z; i < z + 4; i++) {
                    if (i === z) {
                        setRest_info({
                            ...rest_info, name: response.data[i - 1].name,
                            category: response.data[i - 1].categoryOne, id: response.data[i - 1].id, location: response.data[i - 1].location
                            , rating: response.data[i - 1].rating, wish: response.data[i - 1].wishCount, hit: response.data[i - 1].hit, review: response.data[i - 1].reviewCount
                        });
                    }
                    if (i === z + 1) {
                        setRest_info_two({
                            ...rest_info_two, name: response.data[i - 1].name,
                            category: response.data[i - 1].categoryOne, id: response.data[i - 1].id, location: response.data[i - 1].location
                            , rating: response.data[i - 1].rating, wish: response.data[i - 1].wishCount, hit: response.data[i - 1].hit, review: response.data[i - 1].reviewCount
                        });
                    }
                    if (i === z + 2) {
                        setRest_info_three({
                            ...rest_info_three, name: response.data[i - 1].name,
                            category: response.data[i - 1].categoryOne, id: response.data[i - 1].id, location: response.data[i - 1].location
                            , rating: response.data[i - 1].rating, wish: response.data[i - 1].wishCount, hit: response.data[i - 1].hit, review: response.data[i - 1].reviewCount
                        });
                    }
                    if (i === z + 3) {
                        setRest_info_four({
                            ...rest_info_four, name: response.data[i - 1].name,
                            category: response.data[i - 1].categoryOne, id: response.data[i - 1].id, location: response.data[i - 1].location
                            , rating: response.data[i - 1].rating, wish: response.data[i - 1].wishCount, hit: response.data[i - 1].hit, review: response.data[i - 1].reviewCount
                        });
                    }
                    calcDist(response.data[i - 1].location, idd++);
                    setRecommendResultId(prev => {
                        const newState = [...prev];
                        newState[i - 1] = response.data[i - 1].id;
                        return newState;
                    });
                }
            })
            .catch(function (error) {

            });
    }

    const refreshResult = () => {
        reqeustToServer();
    }


    const clickQuestionMark = () => {
        if (document.getElementById("howToUse").style.opacity != 0) {
            document.getElementById("howToUse").style.opacity = 0;
            document.getElementById("howToUse").parentElement.style.border = '1px solid white';
        } else {
            document.getElementById("howToUse").style.opacity = 1;
            document.getElementById("howToUse").parentElement.style.border = '1px solid #b21848';
        }
    }

    return (
        <Faded>
            {popup && <div style={postBox}>
                <button title="X" style={postButtonStyle} onClick={() => setPopup(false)}>X</button>
                <Post addr={addr} setAddr={setAddr} setPopup={setPopup} /></div>}
            <div className="top-recommend-container">
                <div className="recommend-container">
                    <div className="menu-container">
                        <div className="left-menu-container" style={{ position: 'relative' }}>
                            <div className="menu-image" id="left-menu-image" onMouseOut={() => setLeft_hover(false)} onMouseOver={() => setLeft_hover(true)}>
                                <img src={menuImage.leftImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: left_hover && 'blur(5px)', transition: 'all 0.8s' }} alt="" />
                                {left_hover &&
                                    <div className="menu-detail" style={{ width: '0', height: '0' }} id="left-menu-detail">
                                        <span className='all-button' id='left-select-button-eat' onClick={() => selectMenu('left')}>&nbsp;EAT!!&nbsp;</span>
                                        <span className='all-button' id='left-select-button-kick' onClick={() => kickMenu('left')}>KICK!!</span>
                                    </div>
                                }
                            </div>
                            <div className="menu-detail" id="left-menu-detail"></div>
                        </div>
                        <div className="right-menu-container" style={{ position: 'relative' }}>
                            <div className="menu-image" id="right-menu-image" onMouseOut={() => setRight_hover(false)} onMouseOver={() => setRight_hover(true)}>
                                <img src={menuImage.rightImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: right_hover && 'blur(5px)', transition: 'all 0.8s' }} alt="" />
                                {right_hover &&
                                    <div className="menu-detail" style={{ width: '0', height: '0' }} id="right-menu-detail">
                                        <span className='all-button' id='right-select-button-eat' onClick={() => selectMenu('right')}>&nbsp;EAT!!&nbsp;</span>
                                        <span className='all-button' id='right-select-button-kick' onClick={() => kickMenu('right')}>KICK!!</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{ position: 'absolute', transition: 'border 1s ease-in-out', border: '1px solid white', borderRadius: '10px', width: '16vw', height: '5vw', maxHeight: '100px', maxWidth: '320px', transform: 'translate(320%, 50%)', fontSize: 'clamp(0.7px, 0.7vw, 15px)' }}>
                            <div style={{ position: 'absolute', width: '10%', height: '32%', transform: 'translate(0%, -140%)' }}><img src={questionMarkIcon} style={{ width: '100%' }} onMouseOver={clickQuestionMark} onMouseOut={clickQuestionMark}/></div>
                            <div id="howToUse" style={{ opacity: 0, transition: 'opacity 1s ease-in-out'}}>
                                <div style={{ textAlign: 'center' }}>🍽️맛집 추천 사용법🍽️</div>
                                &nbsp;1. 메뉴 카테고리를 EAT 또는 KICK하여 선택<br />
                                &nbsp;2. KICK EAT 로고를 클릭<br />
                                &nbsp;3. 입력된 장소 주변 맛집 추천 받기<br />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='select-menu-container'>
                        <div className="select-menu" id="select-menu1" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image1" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu2" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu3" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image3" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu4" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image4" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <button className='kickEatListButton' id='kickEatListButton' style={{ backgroundImage: `url(${disabledLogo})` }} onClick={showRecommendList}></button>
                    </div>

                </div>
                <div id="recommend-list">
                    {rest_info.category != '' &&
                        <>
                            <h4 style={{ marginTop: '0px', marginBottom: '10px' }}>당신을 위한 추천 음식집 리스트</h4>
                            <div id="locationSearch">
                                <input id="locationSearchBox" type="text" value={addr.address} disabled></input>
                                <div onClick={handleComplete} style={{ backgroundColor: '#b21848', width: '34px', height: '34px', border: '1px solid gray', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><img src={searchIcon} style={{ width: '80%' }} /></div>
                                <div onClick={refreshResult} style={{ backgroundColor: '#b21848', width: '34px', height: '34px', border: '1px solid gray', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><img src={refreshIcon} style={{ width: '80%' }} /></div>
                            </div></>}
                    {rest_info.category != '' && <div className='find-rec-list' id="find-rec-list">
                        <div className='recommendResult' onClick={() => onClickDetail(rest_info.id)}>
                            <img src={`/img/find/${rest_info.category}.png`} />
                            <div className='restaurantName'>{rest_info.name}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{display: 'flex', justifyContent: 'center'}}>
                                    <span className='star-rating'>
                                        <span style={{ width: `${rest_info.rating * 20}%` }}></span>
                                    </span>&nbsp;{rest_info.rating}
                                </li>
                            </ul>
                            <div className='restaurantAddress'>{rest_info.location}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', width: '70%'}}>
                                    <span>🚶🏻‍♂️{dist_one}</span>
                                    <span>👁️‍🗨️{rest_info.hit}</span>
                                    <span>❤️{rest_info.wish}</span>
                                    <span>📖{rest_info.review}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='recommendResult' onClick={() => onClickDetail(rest_info_two.id)}>
                            {<img src={`/img/find/${rest_info_two.category}.png`} />}
                            <div className='restaurantName'>{rest_info_two.name}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{display: 'flex', justifyContent: 'center'}}>
                                    <span className='star-rating'>
                                        <span style={{ width: `${rest_info_two.rating * 20}%` }}></span>
                                    </span>&nbsp;{rest_info_two.rating}
                                </li>
                            </ul>
                            <div className='restaurantAddress'>{rest_info_two.location}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', width: '70%'}}>
                                    <span>🚶🏻‍♂️{dist_two}</span>
                                    <span>👁️‍🗨️{rest_info_two.hit}</span>
                                    <span>❤️{rest_info_two.wish}</span>
                                    <span>📖{rest_info_two.review}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='recommendResult' onClick={() => onClickDetail(rest_info_three.id)}>
                            <img src={`/img/find/${rest_info_three.category}.png`} />
                            <div className='restaurantName'>{rest_info_three.name}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{display: 'flex', justifyContent: 'center'}}>
                                    <span className='star-rating'>
                                        <span style={{ width: `${rest_info_three.rating * 20}%` }}></span>
                                    </span>&nbsp;{rest_info_three.rating}
                                </li>
                            </ul>
                            <div className='restaurantAddress'>{rest_info_three.location}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', width: '70%'}}>
                                    <span>🚶🏻‍♂️{dist_three}</span>
                                    <span>👁️‍🗨️{rest_info_three.hit}</span>
                                    <span>❤️{rest_info_three.wish}</span>
                                    <span>📖{rest_info_three.review}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='recommendResult' onClick={() => onClickDetail(rest_info_four.id)}>
                            <img src={`/img/find/${rest_info_four.category}.png`} />
                            <div className='restaurantName'>{rest_info_four.name}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{display: 'flex', justifyContent: 'center'}}>
                                    <span className='star-rating'>
                                        <span style={{ width: `${rest_info_four.rating * 20}%` }}></span>
                                    </span>&nbsp;{rest_info_four.rating}
                                </li>
                            </ul>
                            <div className='restaurantAddress'>{rest_info_four.location}</div>
                            <ul style={{display: 'flex', justifyContent: 'center'}}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', width: '70%'}}>
                                    <span>🚶🏻‍♂️{dist_four}</span>
                                    <span>👁️‍🗨️{rest_info_four.hit}</span>
                                    <span>❤️{rest_info_four.wish}</span>
                                    <span>📖{rest_info_four.review}</span>
                                </li>
                            </ul>
                        </div>
                    </div>}
                </div>
            </div>
        </Faded>
    )
}

export default Recommend;