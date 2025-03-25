// InquiryView.js (React 프론트엔드)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InquiryView.css';
import { useGlobalState } from '../../../GlobalStateContext';
function InquiryView() {
    const { serverIP } = useGlobalState();
    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [password, setPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [error, setError] = useState('');
    const [reply, setReply] = useState('');
    const [isAuthorOrAdmin, setIsAuthorOrAdmin] = useState(false); // 작성자 또는 관리자 여부
    const navigate = useNavigate();

    useEffect(() => {
        setIsPasswordCorrect(false);
        setInquiry(null);
        setConversation([]);
        setError('');
        setIsAuthorOrAdmin(false); // 초기화

        // 관리자는 비밀번호 없이 바로 접근
        if (sessionStorage.getItem('loginId') === 'admin1234') {
            setIsPasswordCorrect(true);
            setIsAuthorOrAdmin(true); // 관리자는 작성자/관리자 true
            fetchConversation();
        }
    }, [id]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.get(`${serverIP}/board/inquiryView/${id}?password=${password}`)
            .then(response => {
                const inquiryData = response.data;
                setInquiry(inquiryData);

                // 작성자 또는 관리자인지 확인
                const isCurrentUserAuthor = inquiryData.user && sessionStorage.getItem("loginId") === inquiryData.user.userid;
                if (sessionStorage.getItem('loginId') === 'admin1234' || isCurrentUserAuthor) {
                    setIsPasswordCorrect(true);
                    setIsAuthorOrAdmin(true); // 작성자 or admin이면 true
                    fetchConversation();
                } else {
                    // 작성자나 관리자가 아닌 경우
                    setIsPasswordCorrect(false);
                    setIsAuthorOrAdmin(false);  //false
                    setInquiry(null);
                    setError('해당 사용자가 아닙니다.'); // 에러 메시지
                }

            })
            .catch(error => {
                console.error('Error verifying password:', error);
                setIsPasswordCorrect(false);
                setIsAuthorOrAdmin(false);
                setInquiry(null);
                if (error.response && error.response.status === 401) {
                    setError('비밀번호가 일치하지 않습니다.');
                } else {
                    setError('문의 내용을 불러오는 데 실패했습니다.');
                }
            });
    };

    const fetchConversation = () => {
        axios.get(`${serverIP}/board/conversation/${id}`)
            .then(response => {
                setConversation(response.data);
            })
            .catch(error => {
                console.error("Error fetching conversation:", error);
                setError("대화 내용을 불러오는 데 실패했습니다.");
            });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!reply.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }

        axios.post(`${serverIP}/board/addReply/${id}`, { reply: reply, userId: sessionStorage.getItem("loginId") })
            .then(response => {
                alert('답변이 등록되었습니다.');
                setReply('');
                fetchConversation();
            })
            .catch(error => {
                console.error('Error adding reply:', error);
                alert('답변 등록에 실패했습니다.');
            });
    };

    const handleDelete = () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            axios.delete(`${serverIP}/board/delete/${id}`)
                .then(response => {
                    alert('문의글이 삭제되었습니다.');
                    navigate('/boardPage?category=INQUIRY');
                })
                .catch(error => {
                    console.error('Error deleting inquiry:', error);
                    alert('문의글 삭제에 실패했습니다.');
                });
        }
    };

    function formatDateTime(dateTimeString) {
        if (!dateTimeString) {
            return '';
        }
        const date = new Date(dateTimeString);
        if (isNaN(date)) {
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    return (
        <div className="InquiryView_inquiry-view-container">
            <h1>1:1 문의 내용</h1>

            {!isPasswordCorrect && (
                <form onSubmit={handlePasswordSubmit} className="InquiryView_password-form">
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="InquiryView_password-input"
                        placeholder="비밀번호를 입력하세요"
                    />
                    <button type="submit" className='InquiryView_btn-style'>확인</button>
                    {error && <p className="InquiryView_error-message">{error}</p>}
                </form>
            )}

            {isPasswordCorrect && (
                <>
                    <div className="InquiryView_conversation-container">
                        {conversation.map((message, index) => (
                            <div key={index} className={`InquiryView_message ${message.isAdmin ? 'InquiryView_admin-message' : 'InquiryView_user-message'}`}>
                                <div className="InquiryView_message-content">
                                    {message.content}
                                </div>
                                <div className="InquiryView_message-info">
                                    {formatDateTime(message.createDate)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 답변 작성 폼 (관리자 또는 작성자) */}
                    {isAuthorOrAdmin && (
                        <form onSubmit={handleReplySubmit} className="InquiryView_reply-form">
                            <h2>답변 작성</h2>
                            <textarea
                                value={reply}
                                onChange={handleReplyChange}
                                placeholder="답변 내용을 입력하세요..."
                                rows={5}
                                className="InquiryView_reply-textarea"
                            />
                            <button type="submit" className='InquiryView_btn-style'>답변 등록</button>
                        </form>
                    )}

                    <div className="InquiryView_button-container">
                        <button type="button" onClick={() => navigate(`/boardPage?category=INQUIRY`)} className="InquiryView_btn-style">목록</button>
                        {/* 삭제 버튼 (관리자 또는 작성자) */}
                        {isAuthorOrAdmin && (
                            <button type="button" onClick={handleDelete} className="InquiryView_btn-style InquiryView_delete-button">삭제</button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default InquiryView;