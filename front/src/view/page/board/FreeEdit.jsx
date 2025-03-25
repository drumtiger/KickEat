import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../../../GlobalStateContext";
import App from "./App";

function FreeEdit() {
    const { serverIP } = useGlobalState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    
    const {id} = useParams();
    const navigate = useNavigate();

    function changeTitle(event) {
        setTitle(event.target.value);
    }

    const mounted = useRef(false);
    useEffect(()=>{
        if (!mounted.current) {
            mounted.current = true;
            getBoard();
        }
    }, []);

    function getBoard() {
        axios(`${serverIP}/free/view/${id}`)
        .then(res=>{
            setTitle(res.data.title);
            setContent(res.data.content);
            setCategory(res.data.category);
        })
        .catch(err=>{
            console.log(err);
        });
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

        let editData = {
            id: id,
            title: title,
            content: content,
            user: {id: sessionStorage.getItem("id")}
        }

        axios.post(`${serverIP}/free/editOk`, editData)
        .then(res=>{
            if (res.data == 'success') {
                navigate('/boardpage?category=BOARD');
            } else if (res.data == 'fail') {
                alert("게시글이 수정되지 않았습니다.");
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="free-write">
            {
                category === 'free' ? <h2>글수정</h2> : <h2>공지수정</h2>
            }
            
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
            <div id='write-btn' onClick={boardSubmit}>수정</div>
        </div>  
    );
}

export default FreeEdit;