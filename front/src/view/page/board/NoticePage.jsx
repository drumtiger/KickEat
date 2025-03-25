import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './NoticePage.css';
import { useGlobalState } from "../../../GlobalStateContext";
function NoticePage() {
    const { serverIP } = useGlobalState();
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getBoardPage(0, 'NOTICE');
    }, []);

    function getBoardPage(page, category) {
        let url = `${serverIP}/board/boardPage?page=${page}&category=${category}`;
        if(searchWord){
            url += `&searchWord=${searchWord}`;
        }

        axios.get(url)
            .then(function (response) {
                setBoardData(response.data.list);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.totalPages);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleDelete = async (id) => {
        if (sessionStorage.getItem("loginId") !== 'admin1234') {
            alert('관리자만 삭제할 수 있습니다.');
            return;
        }

        if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axios.delete(`${serverIP}/board/delete/${id}`);
            alert('글이 삭제되었습니다.');
            getBoardPage(currentPage, 'NOTICE');
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('글 삭제에 실패했습니다.');
        }
    };

    function searchWordChange(event) {
        setSearchWord(event.target.value)
    }

    function renderPagination() {
        const pageNumbers = [];

        console.log(totalPages);
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={`notice-page-item ${currentPage === i ? 'active' : ''}`}>
                    <a className="notice-page-link" onClick={() => getBoardPage(i, 'NOTICE')}>{i + 1}</a>
                </li>
            );
        }

        console.log(currentPage);
        return (
            <ul className="notice-pagination">
                <li className={'notice-page-item'}>
                    {currentPage > 0 && (<a className="notice-page-link" onClick={() => getBoardPage(currentPage - 1, 'NOTICE')}>Previous</a>)}
                </li>
                {pageNumbers}
                <li className={'notice-page-item'}>
                    {currentPage < totalPages - 1 && (<a className="notice-page-link" onClick={() => getBoardPage(currentPage + 1, 'NOTICE')}>Next</a>)}
                </li>
            </ul>
        );
    }

    return (
        <div className="notice-page-container">
            <div className="notice-page-header">
                <div className="notice-col notice-col-num">번호</div>
                <div className="notice-col notice-col-title">제목</div>
                <div className="notice-col notice-col-author">작성자</div>
                <div className="notice-col notice-col-views">조회수</div>
                <div className="notice-col notice-col-date">등록일</div>
                {sessionStorage.getItem("loginId") === 'admin1234' && (
                    <div className="notice-col notice-col-manage">관리</div>
                )}
            </div>

            {boardData.map((record) => (
                <div className="notice-page-row" key={record.id}>
                    <div className="notice-col notice-col-num">
                        <Link to={`/notice/view/${record.id}`}>{record.id}</Link>
                    </div>
                    <div className="notice-col notice-col-title">
                        <Link to={`/notice/view/${record.id}`} className="notice-title-link">
                            {record.files && record.files.length > 0 && (
                                <img 
                                    src={`${serverIP}${record.files[0].fileUrl}`} 
                                    alt="썸네일" 
                                    className="notice-thumbnail"
                                />
                            )}
                            <span className="notice-subject">{record.subject}</span>
                        </Link>
                    </div>
                    <div className="notice-col notice-col-author">{record.user ? record.user.userid : '알 수 없음'}</div>
                    <div className="notice-col notice-col-views">{record.hit}</div>
                    <div className="notice-col notice-col-date">{record.createDate ? record.createDate.substring(0, 10) : ''}</div>
                    {sessionStorage.getItem("loginId") === 'admin1234' && (
                        <div className="notice-col notice-col-manage">
                            <button 
                                onClick={() => handleDelete(record.id)}
                                className="notice-delete-btn"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {sessionStorage.getItem("loginId") === 'admin1234' && (
                <div className="notice-write-link-container">
                    <Link to="/notice/write" className="notice-write-link">공지등록</Link>
                </div>
            )}
            <div className="notice-write-link-container">
                    <Link to="/free/write" className="notice-write-link">글등록</Link>
            </div>

            {renderPagination()}

            <div className="notice-search-container">
                <input 
                    type="text" 
                    className="notice-search-input" 
                    placeholder="검색어를 입력하세요" 
                    onChange={searchWordChange} 
                    value={searchWord}
                />
                <button 
                    className="notice-search-button" 
                    onClick={() => getBoardPage(0, 'NOTICE')}
                >
                    검색
                </button>
            </div>
        </div>
    );
}

export default NoticePage;