import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../../../GlobalStateContext";

function FreeView(){
    const { serverIP } = useGlobalState();
    const navigate = useNavigate();
    const {id} = useParams();
    let [record, setRecord] = useState({});
    let [commentList, setCommentList] = useState([]);

    const mounted = useRef(false);

    useEffect(()=>{
        if (!mounted.current) {
            mounted.current = true;
            getBoardChoice();
        }
    }, []);

    useEffect(()=>{
        getCommentList();
    },[])


    function getBoardChoice(){
        let url = `${serverIP}/free/view/${id}`;
        if (sessionStorage.getItem("id")) {
            url += '?userNo=' + sessionStorage.getItem("id");
        }
        axios.get(url)
        .then(res=>{
            setRecord({
                id: res.data.id,
                category: res.data.category,
                realid:res.data.user.id,
                userid: res.data.user.userid,
                username: res.data.user.username,
                hit: res.data.hit,
                writedate: res.data.writedate,
                title: res.data.title,
                content: res.data.content
            });
        })
        .catch(err=>{
            console.log(err);
        });
    }

    function boardDel(){
        if (window.confirm("글을 삭제하시겠습니까?")) {
            axios.get(`${serverIP}/free/delete/${id}`)
            .then(res=>{
                if (res.data == 0) {
                    navigate('/boardpage?category=BOARD');
                } else {
                    alert("게시글이 삭제되지 않았습니다.")
                }
            })
            .catch(err=>{
                console.log(err);
            });
        }
    }

    const getCommentList = ()=>{
        axios.get(`${serverIP}/free/commentList/${id}`)
        .then(res=>{
            setCommentList(res.data);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const addComment = ()=>{
        if (!document.getElementById("comment").value.trim()) {
            alert("댓글을 입력하세요.");
            return;
        }

        let commentData = {
            freeBoard: {
                id: record.id
            },
            user: {
                id: sessionStorage.getItem("id")
            },
            content: document.getElementById("comment").value
        }
        axios.post(`${serverIP}/free/addComment`, commentData)
        .then(res=>{
            if (res.data == "success") {
                document.getElementById("comment").value = '';
            } else {
                alert("댓글이 등록되지 않았습니다.")
            }
            getCommentList();
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const commentDel = (comment_id)=>{
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            axios.get(`${serverIP}/free/commentDel/${comment_id}`)
            .then(res=>{
                if (res.data == 0) {
                    getCommentList();
                } else {
                    alert("댓글이 삭제되지 않았습니다.")
                }
            })
            .catch(err=>{
                console.log(err);
            });
        }
    }

    return (
        <div className="view-container">
            <div className="view-box">
                <div className="view-header">
                    <div style={{textAlign: 'left', paddingLeft: '20px'}}>
                        {record.category === 'notice' && <span id="notice-sticker">공지</span>}
                        {record.title}
                        </div>
                    <div style={{ cursor: 'pointer' }}
                                        id={`mgw-${record.realid}`}
                                        className="msg-who">👤{record.username}</div>
                    <div>💬{commentList.length}</div>
                    <div>👁{record.hit}</div>
                </div>
                <div id="view-content" dangerouslySetInnerHTML={{ __html: record.content }}></div>

                <div className="view-comment">
                    {
                        sessionStorage.getItem("loginStatus") === "Y" ?
                        <div style={{display: 'flex'}}>
                            <textarea id="comment" placeholder="댓글을 작성해주세요."/>
                            <input type="button" value="등록" onClick={addComment}/>
                        </div> :
                        <div style={{color: '#555', paddingLeft: '10px'}}>댓글을 작성하려면 로그인 해주세요.</div>
                    }
                    <h4 style={{paddingLeft: '10px'}}>댓글 <span style={{color: '#b21848'}}>{commentList.length}</span>개</h4>
                    <div className="comment-list">
                        {
                            commentList.map(record=>{
                                return (
                                    <div className="comment">
                                        <div style={{fontWeight: 'bold', paddingBottom: '5px',cursor:'pointer'}}
                                        id={`mgw-${record.user.id}`}
                                        className="msg-who">{record.user.username}</div>
                                        <div style={{whiteSpace: 'pre'}}>{record.content}</div>
                                        <div id="comment-writedate">{record.writedate}</div>

                                        {
                                            (sessionStorage.getItem("id") == record.user.id || sessionStorage.getItem('loginId') == 'admin1234') &&
                                            <div id='comment-del-btn' onClick={()=> commentDel(record.id)}>삭제</div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="view-footer">
                    <div id="view-writedate">작성일: {record.writedate}</div>
                        <div className="view-btn">
                            <div onClick={()=>{navigate('/boardpage?category=BOARD')}}>목록</div>
                    {
                        (sessionStorage.getItem("loginId") == record.userid || sessionStorage.getItem('loginId') == 'admin1234') && (
                            <>
                                <div><Link to={`/free/edit/${record.id}`}>수정</Link></div>
                                <div onClick={boardDel}>삭제</div>
                            </>
                        )
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FreeView;