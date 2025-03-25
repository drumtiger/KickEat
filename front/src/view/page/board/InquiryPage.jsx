import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './InquiryList.css';
import { ClipboardX, Pencil } from 'react-bootstrap-icons'; // Pencil 아이콘 추가
import React from "react";
import { useGlobalState } from "../../../GlobalStateContext";

function InquiryList() {
    const { serverIP } = useGlobalState();
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchWord, setSearchWord] = useState('');
    const [expandedItemId, setExpandedItemId] = useState(null);
    const navigate = useNavigate();
    const pageSize = 5;

    const titleHeaderRef = useRef(null);
    const authorHeaderRef = useRef(null);
    const dateHeaderRef = useRef(null);
    const emptyHeaderRef = useRef(null); // 수정/삭제 버튼 공간

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchData();
        }, 100);

        return () => clearTimeout(delaySearch);
    }, [searchWord, currentPage]);

    function fetchData() {
        const searchTermParam = searchWord ? `&searchType=작성자&searchTerm=${searchWord}` : '';
        const inquiryUrl = `${serverIP}/board/boardPage?category=INQUIRY${searchTermParam}`;
        const faqUrl = `${serverIP}/board/boardPage?category=FAQ${searchTermParam}`;

        Promise.all([axios.get(inquiryUrl), axios.get(faqUrl)])
            .then(([inquiryResponse, faqResponse]) => {
                const inquiryData = inquiryResponse.data.list.map(item => ({ ...item, category: 'INQUIRY' }));
                const faqData = faqResponse.data.list.map(item => ({ ...item, category: 'FAQ' }));

                const combinedData = [...faqData, ...inquiryData];
                setBoardData(combinedData);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function searchWordChange(event) {
        setSearchWord(event.target.value);
        setCurrentPage(0);
    }

    const toggleAccordion = (id) => {
        setExpandedItemId(expandedItemId === id ? null : id);
    };

    const handleItemClick = (record) => {
        if (record.category === 'FAQ') {
            toggleAccordion(record.id);
        } else {
            navigate(`/inquiry/view/${record.id}`);
        }
    };


    const displayedData = boardData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handleDelete = async (id) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${serverIP}/board/delete/${id}`);
                fetchData();
                alert("삭제되었습니다.");
            } catch (error) {
                console.error("삭제 중 오류 발생:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 수정 페이지로 이동하는 함수
    const handleUpdate = (id) => {
        navigate(`/faq/update/${id}`);
    }


    useEffect(() => {
        // 데이터가 로드된 후, 그리고 화면 크기가 변경될 때마다 헤더 열 너비 업데이트
        const updateHeaderWidths = () => {
            if (displayedData.length > 0 && titleHeaderRef.current) { //데이터가 있고, ref존재 확인
                const firstDataRow = document.querySelector('.InquiryList_data-row'); // 첫 번째 데이터 행
                if (firstDataRow) {
                    const titleDataCol = firstDataRow.querySelector('[id^="inquiry-title-"]');
                    const authorDataCol = firstDataRow.querySelector('[id^="inquiry-author-"]');
                    const dateDataCol = firstDataRow.querySelector('[id^="inquiry-date-"]');
                    const emptyDataCol = firstDataRow.querySelector('.InquiryList_col:last-child'); // 수정/삭제 버튼

                    if (titleDataCol && authorDataCol && dateDataCol) {
                        titleHeaderRef.current.style.width = `${titleDataCol.offsetWidth}px`;
                        authorHeaderRef.current.style.width = `${authorDataCol.offsetWidth}px`;
                        dateHeaderRef.current.style.width = `${dateDataCol.offsetWidth}px`;

                        if (emptyDataCol) {
                            emptyHeaderRef.current.style.width = `${emptyDataCol.offsetWidth}px`;
                        }
                    }
                }
            }
        };

        updateHeaderWidths(); // 초기 렌더링 시 너비 설정

        window.addEventListener('resize', updateHeaderWidths); // 화면 크기 변경 시 너비 재설정

        return () => {
            window.removeEventListener('resize', updateHeaderWidths); // 컴포넌트 언마운트 시 이벤트 리스너 제거
        };
    }, [displayedData]); // displayedData가 변경될 때마다 useEffect 실행



    function renderPagination() {
        const totalPages = Math.ceil(boardData.length / pageSize);

        if (totalPages <= 1) {
            return null;
        }

        const pageNumbers = [];

        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={`InquiryList_page-item ${currentPage === i ? 'InquiryList_active' : ''}`}>
                    <a className="InquiryList_page-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage(i)}>{i + 1}</a>
                </li>
            );
        }

        return (
            <ul className="InquiryList_pagination InquiryList_justify-content-center">
                <li className={`InquiryList_page-item ${currentPage === 0 ? 'InquiryList_disabled' : ''}`}>
                    <a className="InquiryList_page-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage(currentPage - 1)}>Previous</a>
                </li>
                {pageNumbers}
                <li className={`InquiryList_page-item ${currentPage === totalPages - 1 ? 'InquiryList_disabled' : ''}`}>
                    <a className="InquiryList_page-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage(currentPage + 1)}>Next</a>
                </li>
            </ul>
        );
    }


    return (
        <div className="InquiryList_container">
            <div className="InquiryList_search-write-container">
                <div className="InquiryList_input-group InquiryList_mb-3">
                    <input
                        type="text"
                        className="InquiryList_form-control"
                        placeholder="작성자 검색"
                        onChange={searchWordChange}
                        value={searchWord}
                    />
                </div>

                {sessionStorage.getItem("loginId") && (
                    <Link to="/boardwrite?category=INQUIRY" className="inquiry-write-button" id='inquiry-write-button'>1:1 문의</Link>
                )}

                {sessionStorage.getItem("loginId") === 'admin1234' && (
                    <Link to="/boardwrite?category=FAQ" className="inquiry-faq-button" id='inquiry-write-button'>자주묻는질문</Link>
                )}
            </div>

            <div className="InquiryList_row InquiryList_header-row">
                <div className="InquiryList_col InquiryList_col-sm-4 InquiryList_p-2 InquiryList_text-center" ref={titleHeaderRef}>제목</div>
                <div className="InquiryList_col InquiryList_col-sm-2 InquiryList_p-2 InquiryList_text-center" ref={authorHeaderRef}>작성자</div>
                <div className="InquiryList_col InquiryList_col-sm-3 InquiryList_p-2 InquiryList_text-center" ref={dateHeaderRef}>등록일</div>
                <div className="InquiryList_col InquiryList_col-sm-1 InquiryList_p-2 InquiryList_text-center" ref={emptyHeaderRef}></div>
            </div>

            {displayedData.map((record) => (
                <React.Fragment key={record.id}>
                    <div
                        className={`InquiryList_row InquiryList_data-row ${record.category === 'FAQ' ? 'InquiryList_faq-row' : ''} ${expandedItemId === record.id ? 'InquiryList_active' : ''}`}
                        onClick={() => handleItemClick(record)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div
                            className="InquiryList_col InquiryList_p-2 InquiryList_text-center"
                            id={`inquiry-title-${record.id}`}
                        >
                            {record.category === 'FAQ' && <span>[<strong>자주 묻는 질문</strong>] </span>}
                            {record.subject}
                        </div>
                        <div
                            className="InquiryList_col  InquiryList_p-2 InquiryList_text-center"
                            id={`inquiry-author-${record.id}`}
                        >
                            {record.user ? record.user.userid : '알 수 없음'}
                        </div>
                        <div
                            className="InquiryList_col InquiryList_p-2 InquiryList_text-center"
                            id={`inquiry-date-${record.id}`}
                        >
                            {record.createDate ? record.createDate.substring(0, 10) : ''}
                        </div>

                        <div className="InquiryList_col InquiryList_p-2 InquiryList_text-center">
                            {sessionStorage.getItem("loginId") === 'admin1234' && record.category === 'FAQ' ? (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpdate(record.id); }}
                                        className="InquiryList_update-button"
                                        style={{ marginRight: '5px' }}
                                    >
                                        <Pencil />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                                        className="InquiryList_delete-button"
                                    >
                                        <ClipboardX />
                                    </button>
                                </>
                            ) : (
                                <div style={{ width: '63.656px', height: '24px' }}></div> // 빈 공간
                            )}
                        </div>

                    </div>
                    {record.category === 'FAQ' && (

                        <div className={`InquiryList_row InquiryList_accordion-content ${expandedItemId === record.id ? 'InquiryList_active' : ''}`}>
                            <div className="InquiryList_col InquiryList_col-sm-12 InquiryList_p-2">
                                {record.content}
                            </div>
                        </div>

                    )}
                </React.Fragment>
            ))}

            {renderPagination()}
        </div>
    );
}

export default InquiryList;