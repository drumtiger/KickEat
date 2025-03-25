import React, { useRef, useEffect, useState } from 'react';
import '../../css/page/about.css';
import Faded from '../../effect/Faded';
import FadeIn from '../../effect/FadeIn'
function About() {
  const mount = useRef(false);
  const [positions, setPositions] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const timeoutRef = useRef(null);

  let center_x = window.innerWidth / 2;
  let center_y = window.innerHeight / 2;
  let about_background;
  let current_x = 0;
  let current_y = 0;
  let move_x = 0;
  let move_y = 0;
  const offset_x = 2900;
  const offset_y = 2900;
  const movement = 20;

  function getRandomPositionX() {
    return Math.floor(Math.random() * (4100 + 1)) + 600;
  }

  function getRandomPositionY() {
    return Math.floor(Math.random() * (3100 + 1)) + 800;
  }
  function checkOverlap(newLeft, newTop, positions) {
    for (let i = 0; i < positions.length; i++) {
      const { left, top } = positions[i];
      const isOverlap =
        newLeft < left + 400 &&
        newLeft + 400 > left &&
        newTop < top + 300 &&
        newTop + 300 > top;
      if (isOverlap) {
        return true;
      }
    }
    return false;
  }

  const generateRandomPositions = () => {
    let newPositions = [];
    for (let i = 0; i < 44; i++) {
      let randomLeft, randomTop;
      let overlap = true;
      while (overlap) {
        randomLeft = getRandomPositionX();
        randomTop = getRandomPositionY();
        overlap = checkOverlap(randomLeft, randomTop, newPositions);
      }
      newPositions.push({ left: randomLeft, top: randomTop });
    }
    setPositions(newPositions);
  };

  const timer = () => {
    if((current_x - center_x) / movement > 10) move_x=10;
    else if((current_x - center_x) / movement < -10) move_x=-10;
    else move_x = (current_x - center_x) / movement;
    if((current_y - center_y) / movement > 10) move_y=10;
    else if((current_y - center_y) / movement < -10) move_y=-10;
    else move_y = (current_y - center_y) / movement;
    if (about_background) {
      let t_x = getNumberFromPixel(about_background.style.left) + move_x;
      let t_y = getNumberFromPixel(about_background.style.top) + move_y;
      if (t_x < offset_x / 2 && t_x > -offset_x / 2)
        about_background.style.left = t_x + 'px';
      if (t_y < offset_y / 2 && t_y > -offset_y / 2)
        about_background.style.top = t_y + 'px';
    }
    timeoutRef.current = setTimeout(timer, 20);
  };

  function getNumberFromPixel(_px) {
    if (_px === null || _px === "") {
      return 0;
    }

    _px = _px + "";

    if (_px.indexOf("px") > -1) {
      _px = _px.replace("px", "");
    }

    if (_px.indexOf("PX") > -1) {
      _px = _px.replace("PX", "");
    }

    const result = parseInt(_px, 10);
    if ((result + "") === "NaN") {
      return 0;
    }

    return result;
  }

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      about_background = document.getElementsByClassName('about-container')[0];
      timer();
      const mouseMoving = (e) => {
        current_x = e.clientX;
        current_y = e.clientY;
      };

      window.addEventListener('mousemove', mouseMoving);

      generateRandomPositions();

      return () => {
        window.removeEventListener('mousemove', mouseMoving);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, []);

  return (
    <Faded>
      { !showMore &&
      <>      <div className='about-blur' />
      <div className='about-logo'>
        <ul style={{ display: 'flex' }}>
          <li id='about-kick'>KICK</li>
          <li id='about-img'></li>
        </ul>
        <div id='about-eat'><span>EAT!</span><span>맛을 찾는 새로운 여행</span></div>
      </div>
      <div className='about-container'>
        {positions.map((position, index) => (
          <div
            key={index}
            className={`about-img about-img-${index + 1}`}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
            }}
          />
        ))}
      </div>
      </>
      }
      
      { !showMore &&
      <div className="show-more-container">
        <button 
          className="show-more-btn" 
          onClick={() => setShowMore(!showMore)}
        >▼
        </button>
      </div>
      }

      {showMore && (
        <FadeIn>
        <div className="more-content">
          <div className='more-content-img'/>
          <div className='more-content-top'>
        평범한 <span style={{color:'#b21848'}}>식사</span>는 이제 그만!<br/>
        당신의 미각을 깨워줄 최고의 <span style={{color:'#b21848'}}>맛집</span> 추천!<br/><br/>
        </div>
        <div className='more-content-bottom'>
        당신의 취향과 원하는 조건을 알려주시면 남들이 미처 생각하지 못한 숨은 맛의 비법,<br/>한입 베어 무는 순간 정신이 번쩍 드는 맛집을 소개해 드립니다.<br/>
        새로운 맛의 발견과 특별한 경험을 원한다면, 지금 바로 <span style={{color:'#b21848',fontWeight:'bold'}}>KickEat</span>과 함께하세요.<br/>이제껏 몰랐던 미식의 새로운 세계, <span style={{color:'#b21848',fontWeight:'bold'}}>KickEat</span>과 함께라면 당신의 입맛도 한 단계 업그레이드됩니다!
        </div>
        </div>
        </FadeIn>
      )}
    </Faded>
  );
}

export default About;