import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoticeWrite.css';
import { useGlobalState } from '../../../GlobalStateContext';
const NoticeWrite = () => {
    const { serverIP } = useGlobalState();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('category', 'NOTICE');
        formData.append('user_id', 'admin1234');

        try {
            const response = await axios.post(`${serverIP}/board/eventWriteOk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            alert('공지사항이 등록되었습니다.');
            navigate(`/boardPage?category=NOTICE`);
        } catch (error) {
            console.error('등록 실패:', error);
            alert('등록 실패: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="notice-write-container">
            <h2 className="notice-write-title">공지사항 작성</h2>
            <form onSubmit={handleSubmit} className="notice-write-form">
                <div className="notice-write-group">
                    <label className="notice-write-label">제목</label>
                    <input
                        type="text"
                        className="notice-write-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="notice-write-group">
                    <label className="notice-write-label">내용</label>
                    <textarea
                        className="notice-write-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        required
                    />
                </div>

                <div className="notice-write-buttons">
                    <button type="submit" className="notice-write-submit">
                        등록하기
                    </button>
                    <button
                        type="button"
                        className="notice-write-cancel"
                        onClick={() => navigate('/boardpage?category=NOTICE')}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeWrite;