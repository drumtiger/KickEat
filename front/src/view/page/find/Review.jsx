import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useGlobalState } from '../../../GlobalStateContext';

import ReviewModal from './ReviewModal';

function Review({ getReview, review_list, restaurant_id, isLogin }) {
  const review_mount = useRef(false);

  const [file_id, setFile_id] = useState([]);
  const [isReviewWrite, setIsReviewWrite] = useState(false);
  const [msg, setMsg] = useState('');
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    selected: {},
  });

  const { serverIP } = useGlobalState();
  const [starwid, setStarWid] = useState(0);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);  // 상태로 파일 관리

  useEffect(() => {
    axios
      .get(`${serverIP}/review/getReviewById?id=` + sessionStorage.getItem('id'))
      .then((res) => {
        res.data.forEach((item) => {
          if (restaurant_id === item.restaurant.id) {
            setIsReviewWrite(true);
            return;
          }
        });
      })
      .catch((err) => {});
  }, [review_list]);

  const clickRating = (event) => {
    let a = document.getElementById('st').getBoundingClientRect().left;
    let x = event.clientX - a;
    for (let i = 1; i < 11; i++) {
      if (x < (i * 88) / 10) {
        setStarWid(10 * i);
        break;
      }
    }
  };

  const makeReview = () => {
    const listItems = review_list.map((item, idx) => (
      <li key={'review-' + idx} className="review-chat-box">
        <div className="container-msg">
          <div
            style={{ cursor: 'pointer' }}
            id={'mgw-' + item.entity.user.id}
            className="message-who"
          >
            {item.entity.user.username}
          </div>
          <div className="message-container">
            <div
              className="message-box"
              onClick={() => setReviewModal({ isOpen: true, selected: item.entity.id })}
            >
              <ul>
                <li className="message-text">{item.entity.writedate}</li>
                <li>
                  <span className="star-rating">
                    <span
                      style={{
                        width: `${item.entity.rating * 20}%`,
                        float: 'left',
                      }}
                    ></span>
                  </span>{' '}
                  {item.entity.rating}
                </li>
              </ul>
              <div className="message-comment">{item.entity.comment}</div>
              <img
                id="review-img"
                src={`${serverIP}/uploads/review/${item.entity.id}/${item.imgList[0].filename}`}
              />
            </div>
          </div>
        </div>
      </li>
    ));
    return listItems;
  };

  const changeComment = (e) => {
    setComment(e.target.value);
  };

  const changeFile = (e) => {
    const selectedFiles = Array.from(e.target.files); // 선택된 파일들을 배열로
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);  // 기존 파일 목록에 추가
  };

  const removeFile = (fileToRemove) => {
    // 선택된 파일 목록에서 제거하는 함수
    setFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
  };

  const doSubmit = () => {
    if (comment.length === 0) {
      setMsg('내용을 작성해주세요');
    } else if (starwid === 0) {
      setMsg('별점을 체크해주세요');
    } else if (files.length < 1) {
      setMsg('리뷰 사진을 1개 이상 등록해주세요');
    } else if (files.length > 5) {
      setMsg('리뷰 사진을 5개 이하 등록해주세요');
    } else {
      setMsg('');
      let formData = new FormData();
      formData.append('user', sessionStorage.getItem('id'));
      formData.append('restaurant', restaurant_id);
      formData.append('comment', comment);
      formData.append('rating', starwid / 20);
      for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      axios
        .post(`${serverIP}/review/write`, formData)
        .then((res) => {
          getReview();
          setStarWid(0);
          setComment('');
          setFiles([]);  // 파일 업로드 후 상태 초기화
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const myReview = () => {
    review_list.forEach((item) => {
      if (item.entity.user.id == sessionStorage.getItem('id')) {
        setReviewModal({ isOpen: true, selected: item.entity.id });
        return;
      }
    });
  };

  return (
    <div id="review">
      {reviewModal.isOpen && <ReviewModal reviewModal={reviewModal} setReviewModal={setReviewModal} />}
      {review_list.length !== 0 ? (
        <div className="review-body">
          <ol>{makeReview()}</ol>
        </div>
      ) : (
        <div className="no-review">등록된 리뷰가 없습니다.</div>
      )}

      <div className="review-input-box">
        <div className="input-star">
          <span
            id="st"
            className="star-rating"
            style={{ float: 'left', cursor: 'pointer', marginTop: '5px' }}
            onClick={isLogin && !isReviewWrite ? clickRating.bind(this) : () => {}}
          >
            <span style={{ width: starwid + '%', cursor: 'pointer' }}></span>
          </span>
          {starwid / 20}
        </div>
        <span className="review-err-msg">{msg}</span>
        <div className="boxes">
          {isLogin ? (
            isReviewWrite ? (
              <textarea
                name="comment"
                className="review-input-content"
                value="이미 리뷰를 작성하셨습니다."
                disabled
              />
            ) : (
              <textarea name="comment" className="review-input-content" onChange={changeComment} value={comment} />
            )
          ) : (
            <textarea
              name="comment"
              className="review-input-content"
              value={'로그인 후 리뷰 작성이 가능합니다.'}
              disabled
            />
          )}
          <div className="two-button">
            {isLogin && !isReviewWrite ? (
              <label className="input-file-button" htmlFor="review_files" />
            ) : (
              <label className="input-file-button" htmlFor="" />
            )}
            <input
              type="file"
              style={{ display: 'none' }}
              id="review_files"
              name="review_files"
              className="review-input-image"
              onChange={changeFile}
              multiple
            />
            {isLogin && !isReviewWrite ? (
              <span className="all-button" id="review-submit-button" onClick={doSubmit}>
                리뷰작성
              </span>
            ) : (
              <span className="all-button" id="review-submit-button" onClick={myReview}>
                리뷰보기
              </span>
            )}
          </div>
        </div>
        <div id="preview">
          {/* 선택된 파일들의 이름을 모두 보여줍니다. */}
          {files.length > 0 && (
            <>
              {files.map((file, idx) => (
                <p key={idx}>
                  <span id='r-file-name'>{file.name}</span>
                  <span
                    className="file-remove"
                    style={{ cursor: 'pointer', color: 'red', marginLeft: '5px', marginRight:'10px' }}
                    onClick={() => removeFile(file)}
                  >
                    X
                  </span>
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Review;