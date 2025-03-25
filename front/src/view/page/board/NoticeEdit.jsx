import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './NoticeEdit.css';
import { useGlobalState } from '../../../GlobalStateContext';
const NoticeEdit = () => {
    const { serverIP } = useGlobalState();
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            fetchEventData();
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`${serverIP}/board/view/edit/${id}`);
            const eventData = response.data;
            setTitle(eventData.subject || '');
            setContent(eventData.content || '');
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
        }
    };

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

        if (id) {
            formData.append('event_id', id);
        }

        try {
            const response = await axios.post(`${serverIP}/board/eventWriteOk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            alert('저장되었습니다.');
            navigate('/notice/view/'+id);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 실패: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="notice-edit-container">
            <h2 className="notice-edit-title">
                {id ? '공지사항 수정' : '공지사항 작성'}
            </h2>
            <form onSubmit={handleSubmit} className="notice-edit-form">
                <div className="notice-edit-group">
                    <label className="notice-edit-label">제목</label>
                    <input
                        type="text"
                        className="notice-edit-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="notice-edit-group">
                    <label className="notice-edit-label">내용</label>
                    <textarea
                        className="notice-edit-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        required
                    />
                </div>

                <div className="notice-edit-buttons">
                    <button type="submit" className="notice-edit-submit">
                        {id ? '수정하기' : '등록하기'}
                    </button>
                    <button
                        type="button"
                        className="notice-edit-cancel"
                        onClick={() => navigate('/notice/page')}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeEdit;