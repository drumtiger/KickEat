// EventEdit.js
"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './EventWrite.css';  //  스타일은 EventWrite.css를 사용
import { queryClient } from './EventPage';
import { useGlobalState } from '../../../GlobalStateContext';
function EventEdit() {
    const { serverIP } = useGlobalState();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('EVENT');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [contentImages, setContentImages] = useState([]);
    const [contentImageUrls, setContentImageUrls] = useState([]);
    const [fadeIn, setFadeIn] = useState(false);
    const [initialFiles, setInitialFiles] = useState([]);

    useEffect(() => {
        setFadeIn(true); // 페이지 애니메이션 효과
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`${serverIP}/board/view/edit/${id}`);
                if (!response.ok) throw new Error("이벤트 수정 데이터를 불러오는데 실패했습니다.");
                const eventData = await response.json();

                setTitle(eventData.subject);
                setContent(eventData.content);
                setStartDate(formatDateTimeForInput(eventData.startDate));
                setEndDate(formatDateTimeForInput(eventData.endDate));
                setInitialFiles(eventData.files || []);

                // 기존 파일 정보 설정
                if (eventData.files.length > 0) {
                    setThumbnailUrl(`${serverIP}${eventData.files[0].fileUrl}`);
                    setContentImageUrls(eventData.files.slice(1).map(file => `${serverIP}${file.fileUrl}`));
                }
            } catch (error) {
                console.error("이벤트 데이터 불러오기 오류:", error);
                alert("이벤트 수정 데이터를 불러오는데 실패했습니다.");
                navigate(`/boardpage?category=EVENT`);
            }
        };
        fetchEventData();
    }, [id, location, navigate]);

    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        return new Date(dateTimeString).toISOString().slice(0, 16);
    };

    /** 썸네일 변경 핸들러 */
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailUrl(URL.createObjectURL(file));
        }
    };

    /** 썸네일 삭제 핸들러 */
    const handleRemoveThumbnail = () => {
        setThumbnail(null);
        setThumbnailUrl('');
    };

    /** 내용 이미지 변경 핸들러 */
    const handleContentImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setContentImages(files);
        setContentImageUrls(files.map(file => URL.createObjectURL(file)));
    };

    /** 개별 내용 이미지 삭제 */
    const handleRemoveContentImage = (index) => {
        const updatedImages = contentImages.filter((_, i) => i !== index);
        const updatedUrls = contentImageUrls.filter((_, i) => i !== index);
        setContentImages(updatedImages);
        setContentImageUrls(updatedUrls);
    };

    /** 폼 제출 핸들러 */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || new Date(startDate) > new Date(endDate)) {
            alert('올바른 내용을 입력하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('event_id', id);
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('event_startdate', startDate);
        formData.append('event_enddate', endDate);
        formData.append('category', category);
        formData.append('user_id', sessionStorage.getItem('loginId') || 'admin1234');
        if (thumbnail) formData.append('mf', thumbnail);
        contentImages.forEach(file => formData.append('files', file));

        try {
            const response = await fetch(`${serverIP}/board/eventUpdateOk`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('이벤트 수정에 실패했습니다.');
            alert('글이 수정되었습니다.');
            queryClient.invalidateQueries(["eventList"]);
            navigate(`/events/${id}`);
        } catch (error) {
            console.error('오류:', error);
            alert('글 수정에 실패했습니다.');
        }
    };

    return (
        <div className={`EventWrite_container ${fadeIn ? "EventWrite_fade-in" : ""}`}>
            <h1>글 수정</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <table className="EventWrite_custom-table">
                    <tbody>
                        <tr><th>제목</th><td><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="EventWrite_custom-input"/></td></tr>
                        <tr><th>내용</th><td><textarea value={content} onChange={e => setContent(e.target.value)}  className="EventWrite_custom-textarea"/></td></tr>
                        <tr><th>시작 날짜</th><td><input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="EventWrite_custom-input"/></td></tr>
                        <tr><th>종료 날짜</th><td><input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="EventWrite_custom-input"/></td></tr>
                        
                        {/* 썸네일 */}
                        <tr><th>썸네일</th><td><input type="file" onChange={handleThumbnailChange} className="EventWrite_custom-input"/></td></tr>
                        {thumbnailUrl && (
                            <tr>
                                <th>미리보기</th>
                                <td>
                                    <img src={thumbnailUrl} alt="썸네일" width={100} />
                                    <button type="button" onClick={handleRemoveThumbnail} className="EventWrite_btn-delete-file">삭제</button> {/* 썸네일 삭제 버튼 추가 */}
                                </td>
                            </tr>
                        )}

                        {/* 내용 이미지 */}
                        <tr><th>내용 이미지</th><td><input type="file" multiple onChange={handleContentImagesChange}  className="EventWrite_custom-input"/></td></tr>
                        {contentImageUrls.map((url, index) => (
                            <tr key={index}>
                                <th>미리보기</th>
                                <td>
                                    <img src={url} alt="내용 이미지" width={100} />
                                    <button type="button" onClick={() => handleRemoveContentImage(index)} className="EventWrite_btn-delete-file">삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 버튼 그룹을 div로 감싸고 클래스 적용 */}
                <div className="EventWrite_button-group">
                    <button type="submit" className="EventWrite_btn-style">저장</button>
                    <button type="button" onClick={() => navigate(`/events/${id}`)} className="EventWrite_btn-style">취소</button>
                </div>
            </form>
        </div>
    );
}

export default EventEdit;