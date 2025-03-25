"use client"

import "../../css/user/mypage.css"
import Faded from "../../effect/Faded"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import axios from "axios"
import { useGlobalState } from "../../GlobalStateContext"
import ReviewModal from "../page/find/ReviewModal"

function MyPage() {
  const { serverIP } = useGlobalState();
  const [wishRecord, setWishRecord] = useState([])
  const [wishPageNumber, setWishPageNumber] = useState([])
  const [nowWishPage, setWishNowPage] = useState(1)
  const [totalWishPage, setWishTotalPage] = useState(1)

  const [reviewRecord, setReviewRecord] = useState([])
  const [reviewPageNumber, setReviewPageNumber] = useState([])
  const [nowReviewPage, setNowReviewPage] = useState(1)
  const [totalReviewPage, setTotalReviewPage] = useState(1)

  const [commentRecord, setCommentRecord] = useState([])
  const [board_commentRecord, setBoardCommentRecord] = useState([]);
  const [commentPageNumber, setCommentPageNumber] = useState([])
  const [nowCommentPage, setNowCommentPage] = useState(1)
  const [totalCommentPage, setTotalCommentPage] = useState(1)

  const [freeBoardRecord, setFreeBoardRecord] = useState([])
  const [freeBoardPageNumber, setFreeBoardPageNumber] = useState([])
  const [nowFreeBoardPage, setNowFreeBoardPage] = useState(1)
  const [totalFreeBoardPage, setTotalFreeBoardPage] = useState(1)


  const [graphRecord, setGraphRecord] = useState([])
  const [chartData, setChartDate] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const { pageMove, setPageMove } = useGlobalState();

  const loc = useLocation();

  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    selected:0
  });

  //페이지,마운트
  const mounted = useRef(false)
  useEffect(() => {
    if (mounted.current) {
    } else {
      mounted.current = true
      getWishList(1)
      graphData()
      getReviewList(1)
      getCommentList(1)
      getFreeBoardList(1)
      setPageMove(!pageMove)
    }
  }, [])

  useEffect(() => {
    const categories = graphRecord.map((item) => item.categoryOne)

    const categoryLabels = [
      "한식",
      "중식",
      "일식",
      "양식",
      "아시아음식",
      "패스트푸드",
      "주점",
      "뷔페",
      "분식",
      "기타",
    ]
    const categoryData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    setChartDate(categoryData)
    categories.forEach((category) => {
      if (category === "한식") categoryData[0] += 1
      if (category === "중식") categoryData[1] += 1
      if (category === "일식") categoryData[2] += 1
      if (category === "양식") categoryData[3] += 1
      if (category === "아시아음식") categoryData[4] += 1
      if (category === "패스트푸드") categoryData[5] += 1
      if (category === "주점") categoryData[6] += 1
      if (category === "뷔페") categoryData[7] += 1
      if (category === "분식") categoryData[8] += 1
      if (category === "기타") categoryData[9] += 1
    })
  }, [graphRecord])

  //찜목록 wishList
  const [wishvo, setWishvo] = useState([])

  function getWishList(page) {
    let id;
    if(loc.state == null) id = sessionStorage.getItem("id");
    else id = loc.state.id;
    const url = `${serverIP}/user/getWishList?id=${id}&nowPage=${page}`

    axios
      .post(url)
      .then((res) => {
        //기존 데이터 초기화
        console.log(res.data.re);
        setWishRecord([])
        setWishRecord(res.data.re)
        setWishvo([])
        setWishvo(res.data.we)

        setWishPageNumber([])
        const pwVO = res.data.pwVO

        for (let pw = pwVO.startPageNum; pw < pwVO.startPageNum + pwVO.onePageCount; pw++) {
          if (pw <= pwVO.totalPage) {
            setWishPageNumber((prev) => {
              return [...prev, pw]
            })
          }
        }
        setWishNowPage(pwVO.nowPage)
        setWishTotalPage(pwVO.totalPage)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  function wishDel(id) {
    axios.post(`${serverIP}/tech/wishlist`, {
      restaurant: {id: id},
      user: {id: sessionStorage.getItem("id")},
      state: '♥'
    })

  }

  //리뷰리스트
  function getReviewList(page) {
    let id;
    if(loc.state == null) id = sessionStorage.getItem("id");
    else id = loc.state.id;
    const url = `${serverIP}/user/getReviewList?id=${id}&nowPage=${page}`

    axios
      .post(url)
      .then((result) => {
        //기존 데이터 초기화
        setReviewRecord([])
        setReviewRecord(result.data.review)
        setReviewPageNumber([])
        const prVO = result.data.prVO

        for (let pr = prVO.startPageNum; pr < prVO.startPageNum + prVO.onePageCount; pr++) {
          if (pr <= prVO.totalPage) {
            setReviewPageNumber((prev) => {
              return [...prev, pr]
            })
          }
        }
        setNowReviewPage(prVO.nowPage)
        setTotalReviewPage(prVO.totalPage)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //댓글 리스트
  function getCommentList(page) {
    let id;
    if(loc.state == null) id = sessionStorage.getItem("id");
    else id = loc.state.id;
    const url = `${serverIP}/user/getCommentList?id=${id}&nowPage=${page}`

    axios
      .post(url)
      .then((response) => {
        console.log(response.data);
        //기존 데이터 초기화
        setCommentRecord([])
        setCommentRecord(response.data.comment)
        setCommentPageNumber([])
        setBoardCommentRecord([]);
        setBoardCommentRecord(response.data.free);
        const pcVO = response.data.pcVO

        for (let pc = pcVO.startPageNum; pc < pcVO.startPageNum + pcVO.onePageCount; pc++) {
          if (pc <= pcVO.totalPage) {
            setCommentPageNumber((prev) => {
              return [...prev, pc]
            })
          }
        }
        setNowCommentPage(pcVO.nowPage)
        setTotalCommentPage(pcVO.totalPage)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //글리스트

  function getFreeBoardList(page) {
    let id;
    if(loc.state == null) id = sessionStorage.getItem("id");
    else id = loc.state.id;
    const url = `${serverIP}/user/getFreeBoardList?id=${id}&nowPage=${page}`

    axios
      .post(url)
      .then((response) => {
        console.log(response.data);
        //기존 데이터 초기화
        setFreeBoardRecord([])
        setFreeBoardRecord(response.data.freeBoard)
        setFreeBoardPageNumber([])
        
        const pfVO = response.data.pfVO

        for (let pf = pfVO.startPageNum; pf < pfVO.startPageNum + pfVO.onePageCount; pf++) {
          if (pf <= pfVO.totalPage) {
            setFreeBoardPageNumber((prev) => {
              return [...prev, pf]
            })
          }
        }
        setNowFreeBoardPage(pfVO.nowPage)
        setTotalFreeBoardPage(pfVO.totalPage)
      })
      .catch((error) => {
        console.log(error)
      })
  }
 

  //그래프
  //불러오기
  function graphData() {
    let id;
    if(loc.state == null) id = sessionStorage.getItem("id");
    else id = loc.state.id;
    const url = `${serverIP}/user/graphData?id=${id}`

    axios
      .get(url)
      .then((response) => {
        setGraphRecord([])
        setGraphRecord(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }  

  ChartJS.register(ArcElement, Tooltip, Legend)
  const data = {
    labels: ["한식", "중국식", "일식", "양식", "아시아음식", "패스트푸드", "주점", "뷔페", "분식", "기타"],
    datasets: [
      {
        label: "# of Votes",
        data: chartData,
        backgroundColor: [
          "rgba(255, 0, 0, 0.5)", // 진한 빨강
          "rgba(0, 128, 255, 0.5)", // 진한 파랑
          "rgba(255, 255, 0, 0.5)", // 밝은 노랑
          "rgba(0, 200, 0, 0.5)", // 진한 초록
          "rgba(128, 0, 255, 0.5)", // 진한 보라
          "rgba(255, 165, 0, 0.5)", // 진한 주황
          "rgba(192, 0, 0, 0.5)", // 더 진한 빨강
          "rgba(0, 100, 0, 0.5)", // 더 진한 초록
          "rgba(255, 69, 0, 0.5)", // 진한 주황색
          "rgba(80, 80, 80, 0.5)", // 어두운 회색
        ],
        borderColor: [
          "rgba(200, 230, 201, 0.25)",  // 한식
          "rgba(255, 204, 128, 0.25)",  // 패스트푸드
          "rgba(174, 213, 255, 0.25)",  // 일식
          "rgba(255, 183, 77, 0.25)",   // 중식
          "rgba(179, 229, 252, 0.25)",  // 아시아음식
          "rgba(255, 236, 179, 0.25)",  // 양식
          "rgba(255, 204, 188, 0.25)",  // 주점
          "rgba(225, 190, 231, 0.25)",  // 분식
          "rgba(255, 245, 157, 0.25)",  // 뷔페
          "rgba(197, 202, 233, 0.25)"   // 기타
        ],
        borderWidth: 1,
      },
    ],
  }
  const options = {
    plugins: {
      datalabels: {
        anchor: "end", // 레이블 위치 설정
        align: "start", // 레이블 정렬 설정
        formatter: (value, context) => {
          // 레이블 내용 설정
          return value // 데이터 값 표시
        },
      },
    },
  }

  const boardDel = (id)=>{
    if (window.confirm("글을 삭제하시겠습니까?")) {
      axios.get(`${serverIP}/free/delete/${id}`)
      .then(res=>{
          if (res.data != 0) {
              alert("게시글이 삭제되지 않았습니다.")
          } else {
            getFreeBoardList(1);
          }
      })
      .catch(err=>{
          console.log(err);
      });
    }
  }
  const commentDel = (id)=>{
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      axios.get(`${serverIP}/free/commentDel/${id}`)
      .then(res=>{
        if (res.data != 0) {
          alert("게시글이 삭제되지 않았습니다.")
      } else {
          getCommentList(1);
      }
      })
      .catch(err=>{
          console.log(err);
      });
    }
  }

  return (
    <Faded>
      {reviewModal.isOpen && <ReviewModal reviewModal ={reviewModal} setReviewModal={setReviewModal}/>}
      <div className="mypage-container">
        { loc.state!=null && <h1 style={{marginBottom:'50px'}}>'{loc.state.username}' 님의 정보</h1>}
        <h2 id="graph-title">선호음식</h2>
        <div className="graph-box">
          <Doughnut data={data} options={options} />
        </div>

        <div id="wishlist-box">
          <h2 id="wishlist-title">찜 목록</h2>
          <div className="mypage-table">
                <ul>
                  <li>찜한식당</li>
                  <li>카테고리</li>
                  <li>주소</li>
                  <li></li>
                </ul>
                {wishRecord.map((wishlistup) => (
                  <ul key={wishlistup.id}>
                    <li><Link to={'/findInfo'} state={{id: wishlistup.id}}>{wishlistup.name}</Link></li>
                    <li>{wishlistup.categoryOne}</li>
                    <li>{wishlistup.location}</li>
                    { loc.state == null && <li>
                    </li>}
                  </ul>
                ))}
          </div>
        </div>
        <div className="my-pagination-box">
              <ul className="my-pagination">
                <li className="my-page-item">
                  {
                    (function(){
                      if(nowWishPage > 1){
                        return <a className="my-page-link" onClick={() => getWishList(nowWishPage > 1 ? nowWishPage - 1 : 1)}>
                          ◀
                        </a>
                      }
                    })()
                  }
                </li>
                {wishPageNumber.map((pg) => (
                  <li className={nowWishPage == pg ? "my-page-item active" : "my-page-item"} key={pg}>
                    <a className="my-page-link" onClick={() => getWishList(pg)}>
                      {pg}
                    </a>
                  </li>
                ))}
                <li className="my-page-item">
                {
                    (function(){
                        if (nowWishPage < totalWishPage && nowWishPage > 0){
                          return(
                  <a
                    className="my-page-link"
                    onClick={() => getWishList(nowWishPage < totalWishPage ? nowWishPage + 1 : totalWishPage)}
                  >
                    ▶
                  </a>)
                        }
                      })()
                    }
                </li>
              </ul>
            </div>

        <div id="reviewlist-box">
          <h2 id="reviewlist-title">리뷰 목록</h2>
          <div className="mypage-table">
            <ul id="review-list-table">
              <li>식당이름</li>
              <li>리뷰</li>
              <li>별점</li>
              <li>날짜</li>
            </ul>
            {reviewRecord.map((reviewlistup) => (
              <ul id="review-list-table" key={reviewlistup.id}>
                <li>{reviewlistup.restaurant.name}</li>
                <li style={{cursor:'pointer'}}onClick={()=>setReviewModal({isOpen:true, selected:reviewlistup.id})}>
                  {reviewlistup.comment}
                </li>
                <li>{reviewlistup.rating}</li>
                <li>{reviewlistup.writedate.substring(0, 10)}</li>
              </ul>
            ))}
          </div>
        </div>
        <div className="my-pagination-box">
              <ul className="my-pagination">
                <li className="my-page-item">
                  {
                    (function(){
                      if(nowReviewPage > 1){
                        return(
                  <a className="my-page-link" onClick={() => getReviewList(nowReviewPage > 1 ? nowReviewPage - 1 : 1)}>
                    ◀
                  </a>)
                     }
                   })()
                  }
                </li>
                {reviewPageNumber.map((pgReview) => (
                  <li className={nowReviewPage == pgReview ? "my-page-item active" : "my-page-item"} key={pgReview}>
                    <a className="my-page-link" onClick={() => getReviewList(pgReview)}>
                      {pgReview}
                    </a>
                  </li>
                ))}
                <li className="my-page-item">
                  {
                    (function(){
                      if(nowReviewPage < totalReviewPage && nowReviewPage > 0){
                        return(
                  <a
                    className="my-page-link"
                    onClick={() => getReviewList(nowReviewPage < totalReviewPage ? nowReviewPage + 1 : totalReviewPage)}
                  >
                    ▶
                  </a>)
                  }
                })()
              }
                </li>
              </ul>
            </div>

            <div id="reviewlist-box">
          <h2 id="reviewlist-title">글 목록</h2>
          <div className="mypage-table">
                <ul id="board-list-table">
                  <li>글제목</li>
                  <li>날짜</li>
                  <li></li>
                </ul>
                {freeBoardRecord.map((freeboardlistup) => (
                  <ul id="board-list-table" key={freeboardlistup.id}>
                    <li><Link to={`/free/view/${freeboardlistup.id}`}>{freeboardlistup.title}</Link></li>
                    <li>{freeboardlistup.writedate.substring(0, 10)}</li>
                    { loc.state == null &&
                      <li>
                        <a style={{cursor: 'pointer'}} onClick={()=>boardDel(freeboardlistup.id)}>삭제</a>
                      </li>}
                  </ul>
                ))}
          </div>
        </div>
        <div className="my-pagination-box">
              <ul className="my-pagination">
                <li className="my-page-item">
                {
                    (function(){
                      if(nowFreeBoardPage > 1){
                        return(
                  <a className="my-page-link" onClick={() => getFreeBoardList(nowFreeBoardPage > 1 ? nowFreeBoardPage - 1 : 1)}>
                    ◀
                  </a>)
                      }
                    }
                  )()
                }
                </li>
                {freeBoardPageNumber.map((pfReview) => (
                  <li className={nowFreeBoardPage == pfReview ? "my-page-item active" : "my-page-item"} key={pfReview}>
                    <a className="my-page-link" onClick={() => getFreeBoardList(pfReview)}>
                      {pfReview}
                    </a>
                  </li>
                ))}
                <li className="my-page-item">
                {
                    (function(){
                      if(nowFreeBoardPage < totalFreeBoardPage && nowFreeBoardPage > 0){
                        return(
                  <a
                    className="my-page-link"
                    onClick={() => getFreeBoardList(nowFreeBoardPage < totalFreeBoardPage ? nowFreeBoardPage + 1 : totalFreeBoardPage)}
                  >
                    ▶
                  </a>)
                  }
                })()
              }
                </li>
              </ul>
            </div>


            <div id="reviewlist-box">
          <h2 id="reviewlist-title">댓글 목록</h2>
          <div className="mypage-table">
                <ul id="comment-list-table">
                  <li>글제목</li>
                  <li>댓글</li>
                  <li>날짜</li>
                  <li></li>
                </ul>
                {commentRecord.map((item,idx) => (
                  <ul id="comment-list-table" key={item.id}>
                    { board_commentRecord[idx] && <li>{board_commentRecord[idx].title}</li>}
                    
                      <li>
                        <Link to={`/free/view/${board_commentRecord[idx].id}`}>
                        {item.content}</Link>
                      </li>
                    
                    <li>{item.writedate.substring(0, 10)}</li>
                    { loc.state == null && <li>
                      <a style={{cursor: 'pointer'}} onClick={()=>{commentDel(item.id)}}>삭제</a>
                    </li>}
                  </ul>
                ))}
          </div>
        </div>
        <div className="my-pagination-box">
              <ul className="my-pagination">
                <li className="my-page-item">
                {
                    (function(){
                      if(nowCommentPage > 1){
                        return(
                  <a className="my-page-link" onClick={() => getCommentList(nowCommentPage > 1 ? nowCommentPage - 1 : 1)}>
                    ◀
                  </a>)
                     }
                   })()
                  }
                </li>
                {commentPageNumber.map((pgComment) => (
                  <li className={nowCommentPage == pgComment ? "my-page-item active" : "my-page-item"} key={pgComment}>
                    <a className="my-page-link" onClick={() => getCommentList(pgComment)}>
                      {pgComment}
                    </a>
                  </li>
                ))}
                <li className="my-page-item">
                {
                    (function(){
                      if(nowCommentPage < totalCommentPage && nowCommentPage > 0){
                        return(
                  <a
                    className="my-page-link"
                    onClick={() => getCommentList(nowCommentPage < totalCommentPage ? nowCommentPage + 1 : totalCommentPage)}
                  >
                    ▶
                  </a>)
                  }
                })()
              }
                </li>
              </ul>
            </div>
            
            <div className="bottom-blank">

            </div>

        { loc.state == null && 
        <div className="edit-profile-button-container" style={{marginBottom:'100px'}}>
          <Link to="/editEnter" className="edit-profile-button"> 개인정보수정 </Link>
        </div>
        }
      </div>
    </Faded>
  )
}

export default MyPage

