"use client"

import React, { useState, useEffect, useCallback } from 'react'; // useCallback import 추가
import { useNavigate, useLocation } from 'react-router-dom';
import './EventWrite.css';
// queryClient import (경로 확인 및 수정 필요)
import { queryClient } from './EventPage'; // ✅ import { queryClient } 로 수정 (소문자 q, c)
import { useGlobalState } from '../../../GlobalStateContext';

function BoardWrite() {
    const { serverIP } = useGlobalState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [files, setFiles] = useState([]); // 파일 목록을 배열로 관리
    const navigate = useNavigate();
    const location = useLocation();
    const [category, setCategory] = useState('EVENT');

    useEffect(() => {
        setFadeIn(true); // 페이지가 로드될 때 애니메이션 실행
    }, []);

    useEffect(() => {
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
    }, [location]);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);
    const handleFilesChange = (e) => setFiles(Array.from(e.target.files)); // 여러 파일 처리
    const [fadeIn, setFadeIn] = useState(false);


    // ✅ getSearchKey 함수 복제 (EventList 컴포넌트와 동일하게 구현)
    const getSearchKey = useCallback(() => {
        const category = new URLSearchParams(location.search).get("category") || "EVENT";
        return [`eventList`, category, 1, "제목내용", "", false]; // currentPage를 1로, 검색 조건은 기본값으로 설정
    }, [location.search]);
    // **⚠️ 실제 프로젝트에서는 getSearchKey 함수를 공유하는 방식으로 개선하는 것이 좋습니다.**

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            alert('종료 날짜는 시작 날짜 이후여야 합니다.');
            return;
        }
        if (!thumbnail) {
            alert('썸네일을 업로드하세요.');
            return;
        }
        // if (files.length === 0) { //파일 첨부 필수 X
        //     alert('파일을 업로드하세요.');
        //     return;
        // }

        const formData = new FormData();
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('event_startdate', startDate);
        formData.append('event_enddate', endDate);
        formData.append('mf', thumbnail); // 썸네일

        // 여러 파일 처리
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]); // 'files'라는 이름으로 여러 파일 추가
        }

        const userId = sessionStorage.getItem('loginId') || 'admin1234'; // 임시 ID (실제 로그인 구현 필요)
        formData.append('category', category); // category 추가
        formData.append('user_id', userId);

        fetch(`${serverIP}/board/eventWriteOk`, { // URL 확인
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                alert('글이 등록되었습니다.');
                // **✅ 글 등록 성공 후 쿼리 캐시 무효화**
                queryClient.invalidateQueries(["eventList", category]); 
                navigate(`/boardpage?category=EVENT`);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('글 등록에 실패했습니다.');
            });
    };

    return (
        <div className={`EventWrite_container ${fadeIn ? "EventWrite_fade-in" : ""}`}>
            <h1>글쓰기</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <table className="EventWrite_custom-table">
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td><input type="text" name="event_title" value={title} onChange={handleTitleChange} className="EventWrite_custom-input" /></td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea
                                    name="event_content"
                                    value={content}
                                    onChange={handleContentChange}
                                    className="EventWrite_custom-textarea"
                                    placeholder="내용을 입력하세요..."
                                    rows={10}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>시작 날짜</th>
                            <td><input type="datetime-local" name="event_startdate" value={startDate} onChange={handleStartDateChange} className="EventWrite_custom-input" /></td>
                        </tr>
                        <tr>
                            <th>종료 날짜</th>
                            <td><input type="datetime-local" name="event_enddate" value={endDate} onChange={handleEndDateChange} className="EventWrite_custom-input" /></td>
                        </tr>
                        <tr>
                            <th>썸네일 업로드</th>
                            <td><input type="file" name="mf" onChange={handleThumbnailChange} className="EventWrite_custom-input" /></td>
                        </tr>
                        <tr>
                            <th>파일 업로드</th>
                            <td><input type="file" name="files" multiple onChange={handleFilesChange} className="EventWrite_custom-input" /></td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button type="submit" className="EventWrite_btn-style">저장</button>
                    <button type="button" onClick={() => navigate(`/boardpage?category=EVENT`)} className="EventWrite_btn-style">목록</button>
                </div>
            </form>
        </div>
    );
}

export default BoardWrite;