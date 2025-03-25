// InquiryWrite.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InquiryWrite.css';
import { useGlobalState } from '../../../GlobalStateContext';
function InquiryWrite() {
    const { serverIP } = useGlobalState();
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');
    const [userid, setUserId] = useState('');
    const [subject, setSubject] = useState(''); // 제목 상태 추가

    const navigate = useNavigate();
    const location = useLocation();
    const [category, setCategory] = useState('INQUIRY'); // 기본 카테고리

    useEffect(() => {
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
        const loggedInUserId = sessionStorage.getItem('loginId') || 'admin1234';
        setUserId(loggedInUserId);

        // 카테고리에 따른 제목 초기값 설정
        if (categoryParam === 'FAQ') {
          setSubject('');  // FAQ 제목
        } else {
          setSubject('1:1 문의'); // 1:1 문의 제목
        }

    }, [location]);

    const handleContentChange = (e) => setContent(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleSubjectChange = (e) => setSubject(e.target.value); // 제목 변경 핸들러

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }
        if (category !== 'FAQ' && !password.trim()) { // FAQ가 아닐 때만 비밀번호 검증
            alert('비밀번호를 입력하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('event_title', subject); // 제목
        formData.append('event_content', content);
        formData.append('user_id', userid);
        if (category !== 'FAQ') {  // FAQ가 아닐 때만 비밀번호 전송
            formData.append('password', password);
        }
        formData.append('category', category);

        fetch(`${serverIP}/board/eventWriteOk`, {
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
            console.log('Success:', data);
            alert('등록되었습니다.');
            navigate(`/boardPage?category=INQUIRY`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('등록에 실패했습니다.');
        });
    };

    return (
        <div className="InquiryWrite_inquiry-write-container">
            <h1>{category === 'FAQ' ? '글 작성' : '1:1 문의 작성'}</h1>
            <form onSubmit={handleSubmit} >
                <table className="InquiryWrite_inquiry-write-table">
                    <tbody>
                        {category !== 'FAQ' && ( // FAQ가 아닐 때만 작성자, 비밀번호 표시
                            <>
                                <tr>
                                    <th>작성자</th>
                                    <td>
                                        <input type="text" value={userid} readOnly className="InquiryWrite_inquiry-write-input" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>비밀번호</th>
                                    <td>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="InquiryWrite_inquiry-write-input"
                                            placeholder="비밀번호를 입력하세요"
                                        />
                                    </td>
                                </tr>
                            </>
                        )}

                        {category === 'FAQ' && (
                            <tr>
                                <th>제목</th>
                                <td>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={handleSubjectChange}
                                        className="InquiryWrite_inquiry-write-input"
                                        placeholder="제목을 입력하세요"
                                    />
                                </td>
                            </tr>
                        )}

                        <tr>
                            <th>{category === 'FAQ' ? '내용' : '문의 내용'}</th>
                            <td>
                                <textarea
                                    value={content}
                                    onChange={handleContentChange}
                                    className="InquiryWrite_inquiry-write-textarea"
                                    placeholder="내용을 입력하세요..."
                                    rows={10}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="InquiryWrite_button-container">
                    <button type="button" onClick={() => navigate(`/boardPage?category=INQUIRY`)} className="InquiryWrite_btn-style-list">목록</button>
                    <button type="submit" className="InquiryWrite_btn-style-sign">등록</button>
                </div>
            </form>
        </div>
    );
}

export default InquiryWrite;