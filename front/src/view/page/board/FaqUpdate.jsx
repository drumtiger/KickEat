import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './FaqUpdate.css';
import { useGlobalState } from '../../../GlobalStateContext';

function FaqUpdate() {
  const { serverIP } = useGlobalState();
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState({ subject: '', content: '' });

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await axios.get(`${serverIP}/board/view/${id}`);
        setFaq(response.data);
      } catch (error) {
        console.error("FAQ 정보를 불러오는 중 오류 발생:", error);
        alert("FAQ 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchFaq();
  }, [id]);

  const handleChange = (e) => {
    setFaq({ ...faq, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!faq.subject || !faq.content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
    }


    try {
      await axios.put(`${serverIP}/board/update/${id}`, faq);
      alert("FAQ가 성공적으로 수정되었습니다.");
      navigate('/boardpage?category=INQUIRY'); // 변경된 부분

    } catch (error) {
      console.error("FAQ 수정 중 오류 발생:", error);
      alert("FAQ 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="FaqUpdate_container">
      <h2>FAQ 수정</h2>
      <form onSubmit={handleSubmit} className="FaqUpdate_form">
        <div className="FaqUpdate_form-group">
          <label htmlFor="subject">제목:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={faq.subject}
            onChange={handleChange}
            className="FaqUpdate_form-control"
          />
        </div>
        <div className="FaqUpdate_form-group">
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            name="content"
            value={faq.content}
            onChange={handleChange}
            className="FaqUpdate_form-control FaqUpdate_textarea"
          />
        </div>
        <button type="submit" className="FaqUpdate_submit-button">수정 완료</button>
      </form>
    </div>
  );
}

export default FaqUpdate;