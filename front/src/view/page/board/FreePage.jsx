import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./../board/FreePage.css"
import { useGlobalState } from "../../../GlobalStateContext";
function FreePage() {
    const [boardData, setBoardData] = useState([]);
    const [noticeList, setNoticeList] = useState([]);
    const [pageNumber, setPageNumber] = useState([]);
    const [nowPage, setNowPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [searchWord, setSearchWord] = useState('');
    const [totalRecord, setTotalRecord] = useState(0);
    const [currentView, setCurrentView] = useState('all');
    const mounted = useRef(false);
    const { serverIP } = useGlobalState();
    const { pageMove, setPageMove } = useGlobalState();

    const getBoardList = (page) => {
        console.log("!?");
        let url = `${serverIP}/free/list?nowPage=${page}`;
        if (searchWord !== '') {
            url += `&searchWord=${searchWord}`;
        }

        axios.get(url).then((res) => {
            const { noticeList, list, pVO } = res.data;

            setNoticeList(noticeList);
            setBoardData(list);

            const newPageNumbers = [];
            for (let p = pVO.startPageNum; p < pVO.startPageNum + pVO.onePageCount; p++) {
                if (p <= pVO.totalPage) {
                    newPageNumbers.push(p);
                }
            }
            setPageNumber(newPageNumbers);
            setNowPage(pVO.nowPage);
            setTotalPage(pVO.totalPage);
            setTotalRecord(pVO.totalRecord);
        });
    };

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getBoardList(nowPage);
        }
    }, []);

    useEffect(() => {
        if (mounted.current) {
            getBoardList(nowPage);
        }
    }, [nowPage]);

    const searchWordChange = (e) => {
        setSearchWord(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            getBoardList(1);
        }
    };

    const renderList = (data, isNotice = false) => {
        return data.map((record) => (
            <ul className="free-list" key={record.id}>
                <li>{record.id}</li>
                <li id="free-list-title">
                    <Link to={`/free/view/${record.id}`}>
                        {isNotice && <span id="notice-sticker">공지</span>}
                        <span style={{fontSize:'15px'}}>{record.title.length > 15 ? record.title.substring(0,15)+'...' : record.title }</span>
                    </Link>
                    <span> [{record.comments.length}]</span>
                </li>
                <li>{record.user.username}</li>
                <li>{record.hit}</li>
                <li>{record.writedate}</li>
            </ul>
        ));
    };

    return (
        <div className="free-container">
            <h2>자유게시판</h2>
            <div id="search">
                {currentView === 'all' ? (
                    <div onClick={() => { setCurrentView('notice'); }}>공지 전체 목록</div>
                ) : (
                    <h5 style={{color:'#e55',fontWeight:'bold',cursor:'pointer',textAlign:'left',fontSize:'16px',marginTop:'72px'}} onClick={() => { setCurrentView('all'); }}>게시글 목록</h5>
                )}
                {currentView === 'all' && (
                <><input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    name="searchWord"
                    value={searchWord}
                    onChange={searchWordChange}
                    onKeyUp={handleSearch}
                />
                <input type="button" value="검색" onClick={() => { getBoardList(1); }} />
                    <div style={{float:'right'}}>총 게시글 수: {totalRecord}개</div></>
                )}
            </div>
            
            <div className="board-list">
                <ul className="free-list-header">
                    <li>번호</li>
                    <li>제목</li>
                    <li>작성자</li>
                    <li>조회수</li>
                    <li>등록일</li>
                </ul>
                {currentView === 'all' && boardData.length + noticeList.length !== 0 && (
                    <>
                        {renderList(noticeList.slice(0, 2), true)}
                        {boardData.map((record) => (
                            <ul className="free-list" key={record.id}>
                                <li>{record.id}</li>
                                <li  id="free-list-title">
                                    <Link to={`/free/view/${record.id}`}>
                                        <span style={{fontSize:'15px'}}>{record.title.length > 19 ? record.title.substring(0,19)+'...' : record.title }</span>
                                        <span> [{record.comments.length}]</span>
                                    </Link>
                                </li>
                                <li>
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        id={`mgw-${record.user.id}`}
                                        className="msg-who"
                                    >
                                        {record.user.username}
                                    </span>
                                </li>
                                <li>{record.hit}</li>
                                <li>{record.writedate}</li>
                            </ul>
                        ))}
                    </>
                )}
                {currentView === 'notice' && renderList(noticeList, true)}
            </div>

            {
                currentView === 'all' && boardData.length + noticeList.length === 0 &&
                <div style={{padding: '20px', fontWeight: 'bold', textAlign: 'center'}}>검색 결과가 없습니다.</div>
            }

            <div className="write-btn">
                {sessionStorage.getItem("loginStatus") === "Y" && currentView === 'all' && (
                    <Link state={{ category: 'free' }} to={'/free/write'}><div>글쓰기</div></Link>
                )}
                {sessionStorage.getItem("loginId") === "admin1234" && (
                    <Link state={{ category: 'notice' }} to={'/free/write'}><div>공지 등록</div></Link>
                )}
            </div>

            {currentView === 'all' && (
                <ul className="free-pagination">
                    {nowPage > 1 && (
                        <a className="free-page-link" onClick={() => setNowPage(nowPage - 1)}>
                            <li className="free-page-item">◀</li>
                        </a>
                    )}
                    {pageNumber.map((pg) => {
                        const activeStyle = nowPage === pg ? 'free-page-item active' : 'free-page-item';
                        return (
                            <a className="free-page-link" onClick={() => setNowPage(pg)} key={pg}>
                                <li className={activeStyle}>{pg}</li>
                            </a>
                        );
                    })}
                    {nowPage < totalPage && (
                        <a className="free-page-link" onClick={() => setNowPage(nowPage + 1)}>
                            <li className="free-page-item">▶</li>
                        </a>
                    )}
                </ul>
            )}
        </div>
    );
}

export default FreePage;