import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/menu.css';
import MessageBox from './MessageBox';
import MessageView from "./MessageView";

function Menu() {
    const [open, setOpen] = useState(false);
    const [msg_box, setMsg_box] = useState({
        isOpen: false,
        msg_list: []
    });
    const [timer, setTimer] = useState(null);  // 타이머를 저장할 상태 변수 추가

    useEffect(() => {
        let menu_button = document.getElementsByClassName('menu-button')[0];
        let menu_list = document.getElementsByClassName('menu-list')[0];
        
        if (menu_button && menu_list) {
            const closeMenu = () => {
                menu_list.style.transform = 'translateY(-50%) rotateY(-90deg)';
                menu_button.style.right = '-43px';
                setOpen(false);
            };

            // 메뉴 버튼에 마우스를 올리면 메뉴를 연다.
            menu_button.addEventListener('mouseover', () => {
                clearTimeout(timer);  // 메뉴가 열린 상태에서 마우스를 올리면 타이머 초기화
                menu_list.style.right = '0%';
                menu_list.style.transform = 'translateY(-50%) rotateY(0deg)';
                menu_button.style.right = '-90px';
                setOpen(true);
            });

            // 메뉴 리스트에 마우스가 올라가면 닫기 타이머를 취소하고, 메뉴를 닫지 않음
            menu_list.addEventListener('mouseover', () => {
                clearTimeout(timer);  // 메뉴 안으로 마우스가 들어가면 타이머 초기화
            });

            // 메뉴 리스트에서 마우스가 나가면 300ms 후에 메뉴를 닫음
            menu_list.addEventListener('mouseleave', () => {
                const closeDelay = setTimeout(() => {
                    closeMenu();
                }, 300);  // 300ms 후에 메뉴를 닫는다.
                setTimer(closeDelay);  // 타이머를 상태에 저장
            });

        }
    }, [timer]);  // timer가 변경될 때마다 effect가 실행됨

    const scrollUp = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    const logout = () => {
        sessionStorage.clear();
        window.location.href = "/";
    };

    return (
        <>
            {msg_box.isOpen && <MessageView msg_box={msg_box} setMsg_box={setMsg_box} />}
            <div className='menu-bar'>
                <div className='menu-button'>
                    <br /><br />
                    &nbsp;&nbsp;―<br />
                    &nbsp;&nbsp;―<br />
                    &nbsp;&nbsp;―
                </div>
                <ul className='menu-list'>
                    <div id='menu-title'>메뉴</div>
                    <li>
                        <Link to="/">메인 페이지</Link>
                    </li>
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
                        <Link to="/BoardPage?category=BOARD">자유게시판</Link>
                    </li>
                    <li>
                        <Link to="/BoardPage">1:1문의</Link>
                    </li>
                    {sessionStorage.getItem("loginStatus") === 'Y' ? <li>
                        <Link onClick={logout}>로그아웃</Link>
                    </li> : <li>
                        <Link to="/login">로그인</Link>
                    </li>}
                    <div style={{zIndex:'13'}} id="up-button" onClick={() => scrollUp()}>
                        ▲
                    </div>
                    {sessionStorage.getItem("loginStatus") === 'Y' && <MessageBox msg_box={msg_box} setMsg_box={setMsg_box} open={open} />}
                </ul>
            </div>
        </>
    );
}

export default Menu;