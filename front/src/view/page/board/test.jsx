"use client"

import React, { useState, memo, useCallback, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

// QueryClient 인스턴스를 EventList 컴포넌트 밖에서 생성
export const queryClient = new QueryClient();

// 이벤트 카드 컴포넌트 (memoized)
const MemoizedRenderEventCard = memo(function RenderEventCard({ event }) {
    const hasThumbnail = event.files && event.files.length > 0
    let thumbnailUrl = "/placeholder-simple.svg";

    if (hasThumbnail && event.files[0]) {
        thumbnailUrl = `http://localhost:9977${event.files[0].fileUrl}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return "날짜 미정";
        const date = new Date(dateString);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="event-card" style={{ marginBottom: "20px" }}>
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#e74c3c",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                    }}
                >
                    EVENT
                </div>
                <div style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: "4px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <img
                        src={thumbnailUrl || "/placeholder-simple.svg"}
                        alt={event.subject}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                        onError={(e) => {
                            if (e.target.src !== window.location.origin + "/placeholder-simple.svg") {
                                console.log("Image load failed, using placeholder:", e.target.src);
                                e.target.src = "/placeholder-simple.svg";
                            }
                        }}
                        loading="lazy"
                    />
                </div>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        textAlign: "center",
                        width: "100%",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                    }}
                >
                    <p style={{ fontSize: "14px", margin: "0" }}>
                        <p>시작일: {formatDate(event.startDate)}</p>
                        <p>종료일: {formatDate(event.endDate)}</p>
                    </p>
                </div>
            </div>
            <div style={{ padding: "10px 0" }}>
                <Link to={`/events/${event.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>{event.subject}</h4>
                </Link>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#3498db",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            marginRight: "5px",
                            fontSize: "12px",
                        }}
                    >
                        {event.user?.username?.charAt(0) || "?"}
                    </div>
                    <span style={{ fontSize: "14px" }}>{event.user?.username || "최고관리자"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666" }}>
                    <div>
                        <span>조회: </span>
                        <span style={{ color: "#e74c3c", fontWeight: "bold" }}>{event.hit}</span>
                    </div>
                </div>
                <div style={{ fontSize: "12px", color: "#999", textAlign: "left", marginTop: "5px" }}>
                    {event.createDate ? new Date(event.createDate).toLocaleDateString() : "날짜 미정"}
                </div>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    return prevProps.event === nextProps.event;
});
MemoizedRenderEventCard.displayName = "MemoizedRenderEventCard"

const EventList = memo(function EventList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchType, setSearchType] = useState("제목내용")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showOnlyWithImages, setShowOnlyWithImages] = useState(false)


    const getSearchKey = useCallback(() => {
        const category = "EVENT";
        return [`eventList`, category, currentPage, searchType, searchTerm, showOnlyWithImages]
    }, [currentPage, searchType, searchTerm, showOnlyWithImages])


    const { data, fetchStatus } = useQuery({
        queryKey: getSearchKey(),
        queryFn: ({ queryKey }) => {
            const [_, category, page, searchType, searchTerm, withImages] = queryKey;
            return axios
                .get("http://localhost:9977/board/boardPage", {
                    params: {
                        category,
                        page: page - 1,
                        size: 6,
                        searchType,
                        searchTerm,
                        withImages,
                    },
                })
                .then((res) => res.data);
        },
        // placeholderData: keepPreviousData, // 주석 처리
        staleTime: 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        // onSuccess 주석 처리
        // onSuccess: (data) => {
        //     if (data && data.totalPages) {
        //         setTotalPages(data.totalPages);
        //     } else {
        //         setTotalPages(1);
        //     }
        // },
    });

    // useEffect를 사용하여 data가 변경될 때마다 setTotalPages 호출 (임시 해결책)
    useEffect(() => {
        if (data && data.totalPages) {
            setTotalPages(data.totalPages);
        } else {
            setTotalPages(1);
        }
    }, [data]);


    const sortedEvents = React.useMemo(() => {
        if (data && data.list) {
            return [...data.list].sort((a, b) => {
                const dateA = new Date(a.endDate || 0);
                const dateB = new Date(b.endDate || 0);
                return dateA - dateB;
            });
        }
        return [];
    }, [data]);

    const events = sortedEvents
    const loading = fetchStatus === "fetching"

    const handleSearch = useCallback(
        (e) => {
            e.preventDefault()
            console.log("handleSearch 실행됨", searchTerm, searchType);
            setCurrentPage(1)
        },
        [searchTerm, searchType],
    )

    const renderEventList = useCallback(() => {
        if (loading) {
            return <div style={{ textAlign: "center", padding: "50px 0" }}>로딩 중...</div>
        }
        if (!events || events.length === 0) {
            return (
                <div style={{ gridColumn: "span 3", textAlign: "center", padding: "50px 0" }}>이벤트가 없습니다.</div>
            )
        }
        return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                {events.map((event) => (
                    <MemoizedRenderEventCard key={event.id} event={event} />
                ))}
            </div>
        )
    }, [loading, events])

    const renderPagination = useCallback(() => {
        if (totalPages <= 1) return null
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                            padding: "8px 12px",
                            margin: "0 5px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            background: currentPage === page ? "#f0f0f0" : "white",
                            cursor: "pointer",
                        }}
                    >
                        {page}
                    </button>
                ))}
            </div>
        )
    }, [totalPages, currentPage])

    return (
        <div className="event-list-container">
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        marginRight: "10px",
                    }}>
                        <option value="제목내용">제목+내용</option>
                        <option value="제목만">제목만</option>
                        <option value="작성자">작성자</option>
                    </select>
                    <form onSubmit={handleSearch} style={{ display: "flex" }}>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색어를 입력하세요" style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            marginRight: "5px",
                        }} />
                        <button type="submit" style={{
                            background: "#f8f9fa",
                            color: "#343a40",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}>
                            <span role="img" aria-label="search">🔍</span>
                        </button>
                    </form>
                </div>
            </div>

            {renderEventList()}

            {renderPagination()}

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex" }}></div>
                {sessionStorage.getItem("loginId") === 'admin1234' && (
                    <Link to="/events/write" style={{
                        padding: "10px 15px",
                        background: "#007bff",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                    }}>글쓰기</Link>
                )}
            </div>
        </div>
    )
})
EventList.displayName = "EventList"

const EventPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <EventList />
        </QueryClientProvider>
    );
};

export default EventPage;