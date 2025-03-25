import {useState , useEffect, useRef, useMemo} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/page/mainpage.css';
import Faded from '../../effect/Faded';
import axios from 'axios';
import ReviewModal from './find/ReviewModal';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// FontAwesome 아이콘 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { useGlobalState } from '../../GlobalStateContext';

// 카운트다운 컴포넌트
const EventCountdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endDate]);

  const isUrgent = timeLeft.days < 3;

  if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
    return <div className="countdown-badge">이벤트 종료</div>;
  }

  return (
    <div className={`countdown-badge ${isUrgent ? 'urgent' : ''}`}>
      <span>⏱️</span>
      {timeLeft.days > 0 && <span>{timeLeft.days}일 </span>}
      {timeLeft.hours > 0 && <span>{timeLeft.hours}시간 </span>}
      {(timeLeft.days === 0 && timeLeft.minutes > 0) && <span>{timeLeft.minutes}분 </span>}
      {(timeLeft.days === 0 && timeLeft.hours === 0) && <span>{timeLeft.seconds}초</span>}
      {timeLeft.days > 0 || timeLeft.hours > 0 ? <span>남음</span> : ''}
    </div>
  );
};

// 소셜 미디어 공유 컴포넌트
const SocialShareButtons = ({ eventId, eventTitle }) => {
    const handleKakaoShare = () => {
    window.open('https://www.kakaocorp.com/page/');
  };

  const handleFacebookShare = () => {
    window.open('https://www.facebook.com/');
  };

  const handleTwitterShare = () => {
    window.open('https://twitter.com/');
  };

  return (
    <div className="social-share-container">
      <div className="social-share-button kakao" onClick={handleKakaoShare} title="카카오톡 공유">
        <FontAwesomeIcon icon={faComment} />
      </div>
      <div className="social-share-button facebook" onClick={handleFacebookShare} title="페이스북 공유">
        <FontAwesomeIcon icon={faFacebookF} />
      </div>
      <div className="social-share-button twitter" onClick={handleTwitterShare} title="트위터 공유">
        <FontAwesomeIcon icon={faTwitter} />
      </div>
    </div>
  );
};

function MainPage(){
  const { pageMove, setPageMove } = useGlobalState();
  const { serverIP } = useGlobalState();
  const navigate = useNavigate();
  const [reviewModal, setReviewModal] = useState({
      isOpen: false,
      selected:0
  });
  const main_mount = useRef(false);
  const [event_list, setEvent_list] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(()=>{
      if(main_mount.current){}
      else {
        setPageMove(!pageMove);
        axios.get(`${serverIP}/tech/event`)
        .then(res => {
          let elist = [];
          for(var i=0; i<res.data.length;i++) {
            if(i>=5) break;
            elist.push(res.data[i]);
          }
          // 종료일(endDate)이 빠른 순서대로 정렬
          elist.sort((a, b) => {
            const dateA = new Date(a.endDate || 0);
            const dateB = new Date(b.endDate || 0);
            return dateA - dateB;
          });
          setEvent_list(elist);
        })
        .catch(err => console.log(err))
      }
    },[]);

    const setAPI = () =>{
        axios.get(`${serverIP}:9977/api`)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.log(err));
    }

    const testCrolling = () => {
      window.location.href="#/test";
    }

    const settings = {
          dots: true,
          infinite: true,
          speed: 450,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 5000,
          afterChange: (current) => setCurrentSlide(current),
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

    const [popReview, setPopReview] = useState({});
    const [popRstr, setPopRstr] = useState([]);
    const [popBoard, setPopBoard] = useState([]);
    const [reviewRank, setReviewRank] = useState(0);
    const [rstrRank, setRstrRank] = useState(0);
    const [boardRank, setBoardRank] = useState('hit');

    // useEffect(()=>{
      
    // }, [popRestaurant])

    useEffect(()=>{
      axios.get(`${serverIP}/find/getPopRestaurant`)
      .then(res=>{
        setPopRstr(res.data);
      })
      .catch(err=>console.log(err));
      axios.get(`${serverIP}/find/getPopReview`)
      .then(res=>{
        setPopReview(res.data);
      })
      .catch(err=>console.log(err));
    },[])
    useEffect(()=> {
      axios.get(`${serverIP}/find/getPopBoard?sort=`+boardRank)
      .then(res=> {
        console.log(res.data);
        var cnt=0;
        var result=[];
        for(var i=0;i<res.data.length;i++) {
          if(cnt>=3) break;
          if(boardRank=='notice') {
            if(res.data[i].category=='notice') {
              result.push(res.data[i]);
              cnt++;
            }
          }
          else if(boardRank=='hit') {
            if(res.data[i].category!='notice'){
              result.push(res.data[i]);
              cnt++;
            }
          }
          else {
            if(res.data[i].category!='notice'){
              result.push(res.data[i]);
              cnt++;
            }
          }
        }
        setPopBoard(result);
      })
      .catch(err=>console.log(err))
    },[boardRank])

    const moveBoard = (where) => {
      navigate('free/view/'+where);
    }

    return (
      <Faded>
        <div className="main-container">
        {reviewModal.isOpen && <ReviewModal reviewModal ={reviewModal} setReviewModal={setReviewModal}/>}
          <div className="main-content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
            <div className="main-content-title">
              ▶ <span style={{ 
                color: '#b21848',
                fontWeight: 'bold', 
                fontFamily: "IBM Plex Sans KR, sans-serif"
              }}>KICK!</span> 이벤트
            </div>

            </div>
            {event_list.length > 0 && (
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '8px 15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontWeight: 'bold', color: '#b21848' }}>시작일:</span> {new Date(event_list[currentSlide]?.startDate || new Date()).toLocaleDateString()} | 
                <span style={{ fontWeight: 'bold', color: '#b21848', marginLeft: '10px' }}>종료일:</span> {new Date(event_list[currentSlide]?.endDate || new Date()).toLocaleDateString()}
              </div>
            )}
          </div>
    
          <div className="slider-container" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Slider {...settings}>
              {
                event_list.map((item,idx) => {
                  return(
                  <div key={idx} className="slider-image-banner">
                    <img style={{width:'100%',height:'100%',objectFit:'fill'}}
                      src={`${serverIP}/uploads/board/${item.id}/${item.files[0].fileName}`}/>
                    
                    <EventCountdown endDate={item.endDate} />
                    <SocialShareButtons eventId={item.id} eventTitle={item.subject || '이벤트'} />
                      
                    <Link 
                      className="event-button"
                      to={`/events/${item.id}`}
                    >Click ▶</Link>
                    </div>
                  )
                })
              }
            </Slider>
          </div>
    
          <br /><br /><br /><br /><br /><br />
    
          <div className="main-content-title">
            ▶ <p>EAT!</p> 오늘의 순위
          </div>
    
          <div className="main-today">
            <div className="main-today-left">
              <span>인기 리뷰</span>
              <ul className='main-today-btn'>
                <li onClick={() => { setReviewRank(0) }} style={reviewRank == 0 ? {color: '#b21848', fontWeight: 'bold', zIndex:'3'} : {zIndex:'2',top:'10px'}}>1</li>
                <li onClick={() => { setReviewRank(1) }} style={reviewRank == 1 ? {color: '#b21848', fontWeight: 'bold',zIndex:'3'} : {zIndex:'2',top:'10px'}}>2</li>
                <li onClick={() => { setReviewRank(2) }} style={reviewRank == 2 ? {color: '#b21848', fontWeight: 'bold',zIndex:'3'} : {zIndex:'1',top:'10px'}}>3</li>
              </ul>

              {popReview.review_list != undefined && popReview.review_list[reviewRank]!=undefined && (
                <div style={{cursor:'pointer'}} onClick={()=>setReviewModal({isOpen:true, selected:popReview.review_list[reviewRank].id})}>
                  <div className='pop-img-box'>
                    <img
                      id="pop-rev-photo"
                      src={`${serverIP}/uploads/review/${popReview.review_list[reviewRank].id}/${popReview.file_list[reviewRank].filename}`}
                    />
                    <img id="medal" src={`./img/main/medal${reviewRank+1}.png`}/>
                  </div>
                  <div style={{marginTop:'10px'}}>
                    <span style={{fontWeight: 'bold'}}>📖{popReview.review_list[reviewRank].comment}</span><br/>
                    <span className="star-rating">
                        <span
                          style={{
                            width: `${popReview.review_list[reviewRank].rating * 20}%`,
                            float: "left",
                          }}
                        ></span>
                      </span>
                      <span style={{padding:'0 0px 0 20px'}}>👤{popReview.review_list[reviewRank].user.username}</span>
                      <span style={{padding: '0 20px', position: 'relative'}}>
                        <h5 style={{display:'inline', fontSize: '20px', fontWeight: '100'}}>👁</h5>
                        <span>{popReview.review_list[reviewRank].hit}</span>
                      </span>
                  </div>

                </div>
              )}
              
            </div>
    
            <div className="main-today-right">
              <span>인기 맛집</span>
              <ul className='main-today-btn'>
                <li onClick={() => { setRstrRank(0) }} style={rstrRank == 0 ? {color: '#b21848', fontWeight: 'bold', zIndex:'3'} : {zIndex:'2',top:'10px'}}>1</li>
                <li onClick={() => { setRstrRank(1) }} style={rstrRank == 1 ? {color: '#b21848', fontWeight: 'bold',zIndex:'3'} : {zIndex:'2',top:'10px'}}>2</li>
                <li onClick={() => { setRstrRank(2) }} style={rstrRank == 2 ? {color: '#b21848', fontWeight: 'bold',zIndex:'3'} : {zIndex:'1',top:'10px'}}>3</li>
              </ul>

              {popRstr[rstrRank] && (
                <Link to={'/findInfo'} state={{ id: popRstr[rstrRank].id }}>
                  <>
                    <div className='pop-img-box'>
                      <img
                        id="pop-res-photo"
                        src={`${serverIP}/uploads/review/${popRstr[rstrRank].review_file.review.id}/${popRstr[rstrRank].review_file.filename}`}
                      />
                      <img id="medal" src={`./img/main/medal${rstrRank+1}.png`}/>
                    </div>
                    <div style={{fontWeight: 'bold',marginTop:'10px'}}>🍴{popRstr[rstrRank].rname}</div>
                    <div id="pop-res-detail">
                      <span className="star-rating">
                        <span
                          style={{
                            width: `${popRstr[rstrRank].rating * 20}%`,
                            float: "left",
                          }}
                        ></span>
                      </span>
                      <span style={{padding: '0 10px'}}>{popRstr[rstrRank].review_count}명</span>
                      <span style={{padding: '0 10px'}}>♥ {popRstr[rstrRank].wish_count}</span>
                      <span style={{padding: '0 10px', position: 'relative'}}>
                        <h5 style={{display:'inline', fontSize: '20px', fontWeight: '100'}}>👁</h5>
                        <span>{popRstr[rstrRank].hit}</span>
                      </span>
                    </div>
                  </>
                </Link>
              )}
            </div>
            <div className='main-today-three'>
            <span>인기 게시글</span>
            <ul className='main-today-btn'>
              <li onClick={() => { setBoardRank('hit') }} style={boardRank == 'hit' ? {color: '#b21848', fontWeight: 'bold', zIndex:'3',fontSize:'12px',whiteSpace:'nowrap'} : {zIndex:'2',top:'10px',fontSize:'12px',whiteSpace:'nowrap'}}>조회순</li>
              <li onClick={() => { setBoardRank('comment') }} style={boardRank == 'comment' ? {color: '#b21848', fontWeight: 'bold',zIndex:'3',fontSize:'12px',whiteSpace:'nowrap'} : {zIndex:'2',top:'10px',fontSize:'12px',whiteSpace:'nowrap'}}>댓글순</li>
              <li onClick={() => { setBoardRank('notice') }} style={boardRank == 'notice' ? {color: '#b21848', fontWeight: 'bold',zIndex:'3',fontSize:'12px',whiteSpace:'nowrap'} : {zIndex:'1',top:'10px',fontSize:'12px',whiteSpace:'nowrap'}}>공지사항</li>
            </ul>
            <div className='main-board-container'>
              <div className='main-board-box' id='main-board-box-tt'>
                <div>번호</div>
                <div>제목</div>
                <div>작성자</div>
                {boardRank=='comment' ? <div>댓글수</div>:<div>조회수</div>}
              </div>
              {
                popBoard.map((item,idx)=> {
                  return(
                    <div className='main-board-box'>
                      <div style={{display:'flex',padding:'0px',alignItems:'center'}}><img style={{width:'100%', height:'50%',margin:'0px',objectFit:'contain'}} src={`./img/main/medal${idx+1}.png`}/></div>
                      <div style={{display:'flex',padding:'0px',alignItems:'center', whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',cursor:'pointer'}} onClick={() => moveBoard(item.id)}>{item.title}</div>
                      <div style={{display:'flex',padding:'0px',alignItems:'center', justifyContent:'center', whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',cursor:'pointer'}} id={`mgw-${item.user.id}`} className="msg-who">{item.user.username}</div>
                      {boardRank=='comment' ? <div style={{display:'flex',padding:'0px',alignItems:'center', justifyContent:'center', whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.comments.length}</div>:<div style={{display:'flex',padding:'0px', justifyContent:'center',alignItems:'center', whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.hit}</div>}
                    </div>
                  )
                })
              }
            </div>
          </div>
          </div>

              

          <button onClick={setAPI} style={{ display: 'none', marginTop: '300px' }}>
            절대 클릭 [X] api테스트용
          </button>
          <button onClick={testCrolling} style={{ display: 'none', marginTop: '100px' }}>
            크롤링 테스트용
          </button>
        </div>
      </Faded>
    );
    
}

export default MainPage;