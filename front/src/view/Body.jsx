import { Navigate, Route, Routes } from "react-router-dom";
import {useState,useEffect,useRef} from 'react';
import axios from 'axios';

import MainPage from "./page/MainPage";
import About from "./page/About";
import Login from "./user/Login";
import Signup from "./user/Singup";
import Board from "./page/board/BoardPage";
import BoardWrite from "./page/board/EventWrite";
import EventView from "./page/board/EventView";
import InquiryPage from "./page/board/InquiryPage";
import InquiryWrite from "./page/board/InquiryWrite";
import InquiryView from "./page/board/InquiryView";
import Find from "./page/find/Find";
import Recommend from "./page/recommend/Recommend";
import MyPage from "./user/MyPage";
import FindInfo from "./page/find/FindInfo";
import Test from "./Test";
import NoticeWrite from "./page/board/NoticeWrite";
import NoticeView from "./page/board/NoticeView";
import InquiryList from "./page/board/InquiryPage"; // 중복된 import 정리 ✅
import EventEdit from "./page/board/EventEdit"; // ✅ EventEdit 컴포넌트 import 추가!
import NoticeEdit from "./page/board/NoticeEdit";
import NoticePage from "./page/board/NoticePage";
import FaqUpdate from "./page/board/FaqUpdate";
import FreeWrite from "./page/board/FreeWrite";
import FreePage from "./page/board/FreePage";
import FreeView from "./page/board/FreeView";
import FreeEdit from "./page/board/FreeEdit";
import EnterEdit from "./user/EnterEdit";
import EditPage from "./user/EditPage";
import Interact from "./page/Interact";
import Idfind from "./user/Idfind";
import Pwfind from "./user/Pwfind";
import ConfirmEdit from "./user/ConfirmEdit";
import { useGlobalState } from "../GlobalStateContext";

function Body() {
  const [interact, setInteract] = useState({
    isOpen: false,
    selected: 0,
  });
  const { serverIP } = useGlobalState();
  const { pageMove } = useGlobalState();
  const al_mount = useRef(false);

  useEffect(() => {
    if (!al_mount.current) {
      al_mount.current = true;

      const handleClick = (e) => {
        if (e.target.className === 'message-who' || e.target.className === 'msg-who') {
          axios.post(`${serverIP}/tech/selUser`, {
            id: e.target.id.split('-')[1],
          })
          .then(res => {
            if (sessionStorage.getItem('id') != res.data.id) {
              setInteract({
                selected: res.data,
                isOpen: true,
                where: e,
              });
            }
          })
          .catch(err => console.log(err));
        }
      };

      window.addEventListener('click', handleClick);

      return () => {
        window.removeEventListener('click', handleClick);
      };
    }
  }, []);
  useEffect(()=>{
    window.scrollTo({top:0,left:0,behavior:'smooth'});
  },[pageMove])
  return (
    <>{interact.isOpen && <Interact interact={interact} setInteract={setInteract}/>}
    <Routes>
      {/* 기본 페이지 */}
      <Route path="/" element={<MainPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 이벤트 게시판 */}
      <Route path="/boardpage" element={<Board />} />
      <Route path="/events/write" element={<BoardWrite />} />
      <Route path="/events/:id" element={<EventView />} />
      <Route path="/events/edit/:id" element={<EventEdit />} />

      {/* 문의 게시판 (Inquiry) */}
      <Route path="/inquiry" element={<InquiryPage />} />
      <Route path="/inquiry/list" element={<InquiryList />} /> {/* 문의 리스트 ✅ */}
      <Route path="/inquiry/write" element={<InquiryWrite />} /> {/* 글쓰기 ✅ */}
      <Route path="/inquiry/view/:id" element={<InquiryView />} /> {/* 글 보기 ✅ */}
      <Route path="/faq/update/:id" element={<FaqUpdate />} />


      {/* 공지사항 게시판 (Notice) */}
      <Route path="/notice/page" element={<NoticePage/>}/>
      <Route path="/notice/write" element={<NoticeWrite/>}/>
      <Route path="/notice/view/:id" element={<NoticeView/>}/>
      <Route path="/notice/edit/:id" element={<NoticeEdit/>}/>

      {/* 자유 게시판 (Free) */}
      <Route path="/free" element={<FreePage/>}/>
      <Route path="/free/write" element={<FreeWrite/>}/>
      <Route path="/free/view/:id" element={<FreeView/>}/>
      <Route path="/free/edit/:id" element={<FreeEdit/>}/>

      {/* 추가된 경로 */}
      <Route path="/boardwrite" element={<InquiryWrite/>} /> {/* 추가된 경로 ✅ */}

      {/* 기타 */}
      <Route path="/find" element={<Find />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/userInfo" element={<MyPage />} />
      <Route path="/findInfo" element={<FindInfo />} />
      <Route path="/test" element={<Test />} />
      <Route path="/editEnter" element={<EnterEdit/>} />
      <Route path="/idfind" element={<Idfind/>} />
      <Route path="/pwfind" element={<Pwfind/>} />
      <Route path="/confirmEdit" element={<ConfirmEdit/>} />

      {/* 기본적으로 이벤트 게시판으로 이동 */}
      <Route path="/" element={<Navigate to="/boardpage?category=EVENT" />} />
    </Routes>
    </>
  );
}

export default Body;