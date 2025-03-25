import {Link} from 'react-router-dom';
import '../css/header.css';
import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Interact from './page/Interact';

function Header() {

    const logout = () => {
        sessionStorage.clear();
        window.location.href="/";
    }

    useEffect(()=>{
        document.getElementsByClassName("hamburger")[0].onmouseover = ()=>{
            document.getElementsByClassName("hamburger-menu")[0].style.display = "block";
        }
        document.getElementsByClassName("hamburger")[0].onmouseout = ()=>{
            document.getElementsByClassName("hamburger-menu")[0].style.display = "none";
        }
    })

    return (
      <ul className="header">
        <li>
            <ul className="header-left">        
                <li>
                <Link to="/"><div id="logo-img"></div></Link>
                </li>
                <li>
                <Link id="header-logo" to="/">KICK EAT</Link>
                </li>
            </ul>
        </li>
        <li>
            <ul className="header-center">
                <li>
                    <Link to="/about">소개</Link>
                </li>
                <li>
                    <Link to="/find">음식점 찾기</Link>
                </li>
                <li>
                    <Link to="/recommend">맛집 추천</Link>
                </li>
                <li>
                    <Link to="/boardPage?category=BOARD">자유게시판</Link>
                </li>
                <li>
                    <Link to="/boardpage">1:1문의</Link>
                </li>
            </ul>
        </li>
        <li>
            <ul className="header-right">
                {sessionStorage.getItem("loginStatus") === 'Y' ? <li>
                    <Link to='/mypage'>마이페이지</Link>
                </li> : <li>
                    <Link to="/signup">회원가입</Link>
                </li>}
                {sessionStorage.getItem("loginStatus") === 'Y' ? <li>
                    <Link onClick={logout}>로그아웃</Link>
                </li> : <li>
                    <Link to="/login">로그인</Link>
                </li>}
                {sessionStorage.getItem("loginStatus") === 'Y' && <div id="header-who">환영합니다 '<h5>{sessionStorage.getItem("loginName")}</h5>' 님</div>}
            </ul>
        </li>

        <div className='hamburger'>
            <div id="hambuger-btn" style={{textAlign: 'right', paddingRight: '30px', fontSize: '24pt', color: '#b21848'}}>☰</div>
            <ul className='hamburger-menu'>
                <li>
                    <Link to="/about">소개</Link>
                </li>
                <li>
                    <Link to="/find">음식점 찾기</Link>
                </li>
                <li>
                    <Link to="/recommend">맛집 추천</Link>
                </li>
                <li>
                    <Link to="/boardPage?category=BOARD">자유게시판</Link>
                </li>
                <li>
                    <Link to="/boardpage">1:1문의</Link>
                </li>
            </ul>
        </div>
      </ul>
    );
  }
  
  export default Header;
  