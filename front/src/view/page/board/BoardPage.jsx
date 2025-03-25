"use client"

import { useEffect, useState, Suspense } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Clipboard2, CalendarHeart, PatchQuestion} from 'react-bootstrap-icons'; // ClipboardX 아이콘 추가
import InquiryPage from "./../board/InquiryPage"
import EventList from "./EventPage"
import NoticePage from "./NoticePage"
import FreePage from "./FreePage";
import "./../board/BoardPage.css"

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div
    style={{
      textAlign: "center",
      padding: "50px 0",
      minHeight: "600px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          margin: "0 auto 20px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p>로딩 중...</p>
    </div>
  </div>
)

// 페이드 인 애니메이션 컴포넌트
const FadeInSection = ({ children, isVisible }) => {
  return (
    <div
    className={`BoardPage_fade-in-section ${isVisible ? "BoardPage_active" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        minHeight: "600px",
      }}
    >
      {children}
    </div>
  )
}

function BoardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isRowVisible, setIsRowVisible] = useState(true); // 버튼 영역의 가시성 상태

  // 현재 URL에서 카테고리 가져오기
  const getActiveCategory = () => {
    const queryParams = new URLSearchParams(location.search)
    return queryParams.get("category") || "INQUIRY"
  }

  // 상태 정의
  const [activeCategory, setActiveCategory] = useState(getActiveCategory())
  const [pageVisible, setPageVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)

  // 디버깅 로그
  // console.log("현재 URL:", location.pathname + location.search)
  // console.log("활성 카테고리:", activeCategory)
  // console.log("현재 표시 카테고리:", currentCategory)
  // console.log("컨텐츠 가시성:", contentVisible)

  // 해시 라우팅(#) 문제 해결을 위한 useEffect
  useEffect(() => {
    if (location.hash && location.hash.includes("#/boardpage")) {
      const newPath = location.hash.replace("#", "")
      navigate(newPath, { replace: true })
    }
  }, [location.hash, navigate])

  // URL 변경 감지 및 activeCategory 업데이트
  useEffect(() => {
    const newCategory = getActiveCategory()
    // console.log("URL 변경 감지:", activeCategory, "->", newCategory)

    if (newCategory !== activeCategory) {
      setActiveCategory(newCategory)
    }
  }, [location.search])

  // 페이지 마운트 시 애니메이션
  useEffect(() => {
    // 페이지 마운트 시 애니메이션 처리
    setPageVisible(false)
    setContentVisible(false)
    setIsLoading(true)

    // 약간의 지연 후 페이지 표시 애니메이션 시작
    const pageTimer = setTimeout(() => {
      setPageVisible(true)
      setIsLoading(false)

      // 페이지가 표시된 후 컨텐츠 표시 애니메이션 시작
      const contentTimer = setTimeout(() => {
        setCurrentCategory(activeCategory)
        setContentVisible(true)
      }, 200)

      return () => clearTimeout(contentTimer)
    }, 100)

    return () => clearTimeout(pageTimer)
  }, []) // 컴포넌트 마운트 시에만 실행

  // activeCategory 변경 감지 및 컨텐츠 업데이트
  useEffect(() => {
    // console.log("activeCategory 변경 감지:", currentCategory, "->", activeCategory)

    // activeCategory가 변경되면 페이드 아웃 후 페이드 인
    if (currentCategory !== null && currentCategory !== activeCategory) {
      setContentVisible(false)

      const timer = setTimeout(() => {
        setCurrentCategory(activeCategory)

        const fadeInTimer = setTimeout(() => {
          setContentVisible(true)
        }, 100)

        return () => clearTimeout(fadeInTimer)
      }, 300)

      return () => clearTimeout(timer)
    } else if (currentCategory === null) {
      // 첫 렌더링 시 현재 카테고리 설정
      setCurrentCategory(activeCategory)
    }
  }, [activeCategory, currentCategory])

  const handleCategoryClick = (category) => {
    if (category === activeCategory) return
    navigate(`/boardpage?category=${category}`)
  }

  // 카테고리 컴포넌트 렌더링
  const renderCategoryComponent = () => {
    // console.log("렌더링 카테고리:", currentCategory)

    if (!currentCategory) return null

    // 각 카테고리별로 고유한 키를 가진 컴포넌트 반환
    switch (currentCategory) {
      case "EVENT":
        return <EventList key={`event-list-${Date.now()}`} />
      case "INQUIRY":
        return <InquiryPage key={`inquiry-page-${Date.now()}`}/>
      case "BOARD":
        return <FreePage key={`board-page-${Date.now()}`} />
      case "NOTICE":
        return <NoticePage key={`notice-${Date.now()}`}/>
      case "FAQ":
        return <div key={`faq-${Date.now()}`}>FAQ 목록이 표시됩니다.</div>
      default:
        return <div key={`default-${Date.now()}`}>카테고리를 선택해주세요.</div>
    }
  }

  // 인라인 스타일 정의
  const pageContainerStyle = {
    opacity: pageVisible ? 1 : 0,
    transform: pageVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
    width: "100%",
    height: "100%",
  }

    // 헤더 겹침 감지 로직
    useEffect(() => {
      const checkHeaderOverlap = () => {
        const header = document.querySelector('header'); // 실제 헤더 선택자
        const row = document.querySelector('.BoardPage_row');
  
        if (!header || !row) return;
  
        const headerRect = header.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
  
        // 겹침 여부 확인
        const isOverlapping = headerRect.bottom > rowRect.top;
        setIsRowVisible(!isOverlapping); // 겹치면 숨김
      };
  
      // 초기 로드 및 스크롤 이벤트 시 겹침 확인
      checkHeaderOverlap();
      window.addEventListener('scroll', checkHeaderOverlap);
  
      return () => {
        window.removeEventListener('scroll', checkHeaderOverlap);
      };
    }, []);

  return (
    <div style={pageContainerStyle}>
      <div className="BoardPage_container">
        { activeCategory !=='INQUIRY' &&
        <div className="BoardPage_row" style={{ display: isRowVisible ? 'flex' : 'none' }}>
          {[
            { category: "BOARD", icon: <Clipboard2/>, text: "BOARD" },
            { category: "EVENT", icon: <CalendarHeart />, text: "EVENT" },
            // { category: "NOTICE", icon: <ClipboardX />, text: "NOTICE" },
          ].map(({ category, icon, text }) => (
            <div
              key={category}
              className={`BoardPage_category-button ${activeCategory === category ? "BoardPage_active" : ""}`}
              onClick={() => category!='BOARD' && handleCategoryClick(category)}
            >
              <Link
                to={`/boardpage?category=${category}`}
                className="BoardPage_link"
                onClick={(e) => {
                  e.preventDefault(); // 기본 링크 동작 방지
                  handleCategoryClick(category);
                }}
              >
                <div className="icon">{icon}</div>
                <div className="text">{text}</div>
              </Link> 
            </div>
          ))}
        </div>
        }

        <Suspense fallback={<LoadingFallback />}>
          {isLoading ? (
            <LoadingFallback />
          ) : (
            <FadeInSection isVisible={contentVisible}>{renderCategoryComponent()}</FadeInSection>
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default BoardPage