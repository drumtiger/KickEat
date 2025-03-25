import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoticeView.css';
import { useGlobalState } from '../../../GlobalStateContext';
const NoticeView = () => {
    const { serverIP } = useGlobalState();
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const isAdmin = sessionStorage.getItem("loginId") === 'admin1234';

    useEffect(() => {
        fetchNoticeData();
    }, [id]);

    const fetchNoticeData = async () => {
        try {
            const response = await axios.get(`${serverIP}/board/view/${id}`);
            setNotice(response.data);
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
            alert('게시글을 불러오는데 실패했습니다.');
            navigate('/boardpage?category=NOTICE');
        }
    };

    const handleEdit = () => {
        navigate(`/notice/edit/${id}`);
    };

    const handleDelete = async () => {
        if (!isAdmin) {
            alert('관리자만 삭제할 수 있습니다.');
            return;
        }

        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${serverIP}/board/delete/${id}`);
                alert('게시글이 삭제되었습니다.');
                navigate('/boardpage?category=NOTICE');
            } catch (error) {
                console.error('삭제 실패:', error);
                alert('게시글 삭제에 실패했습니다.');
            }
        }
    };

    if (!notice) {
        return <div className="notice-view-loading">로딩 중...</div>;
    }

    return (
        <div className="notice-view-container">
            <div className="notice-view-header">
                <h2 className="notice-view-title">{notice.subject}</h2>
                <div className="notice-view-info">
                    <span className="notice-view-date">
                        작성일: {new Date(notice.regdate).toLocaleDateString()}
                    </span>
                    <span className="notice-view-writer">
                        작성자: {notice.user_id}
                    </span>
                </div>
            </div>

            <div className="notice-view-content">
                {notice.content}
            </div>

            <div className="notice-view-buttons">
                <button 
                    className="notice-view-list-btn"
                    onClick={() => navigate('/boardpage?category=NOTICE')}
                >
                    목록으로
                </button>
                {isAdmin && (
                    <>
                        <button 
                            className="notice-view-edit-btn"
                            onClick={handleEdit}
                        >
                            수정
                        </button>
                        <button 
                            className="notice-view-delete-btn"
                            onClick={handleDelete}
                        >
                            삭제
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NoticeView;