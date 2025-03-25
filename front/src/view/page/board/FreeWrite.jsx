import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../../../GlobalStateContext";
import App from "./App";

function FreeWrite() {
    const { serverIP } = useGlobalState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const loc = useLocation();
    const navigate = useNavigate();

    function changeTitle(event) {
        setTitle(event.target.value);
    }
    function boardSubmit() {
        if (!title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        let writeData = {
            title: title,
            content: content,
            category: loc.state.category,
            user: {id: sessionStorage.getItem("id")}
        }

        axios.post(`${serverIP}/free/writeOk`, writeData)
        .then(res=>{
            if (res.data == 'success') {
                navigate('/boardpage?category=BOARD');
            } else if (res.data == 'fail') {
                alert("게시글이 등록되지 않았습니다.");
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="free-write">
            <h2>글쓰기</h2>
            <div>
                <label htmlFor="title">제목</label>
                <input type="text" id="title" placeholder="글제목을 입력해주세요." name="title"
                    value={title} onChange={changeTitle}
                />
            </div>

            <div>
                <label htmlFor="content">글내용</label>
                <App id="content" content={content} setContent={setContent}></App>
            </div>

            <div id='list-btn' onClick={()=>navigate('/boardpage?category=BOARD')}>목록</div>
            <div id='write-btn' onClick={boardSubmit}>글등록</div>
        </div>  
    );
}

export default FreeWrite;