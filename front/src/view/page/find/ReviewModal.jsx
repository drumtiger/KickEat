import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useGlobalState } from "../../../GlobalStateContext";

function ReviewModal({ reviewModal, setReviewModal }) {
  const { serverIP } = useGlobalState();
  const mount = useRef(true);
  const [review, setReview] = useState({});
  const [img_list, setImg_list] = useState([]);
  const [isDel, setIsDel] = useState(false);

  useEffect(() => {
    if (!mount.current) mount.current = false;
    else {
      axios
        .get(`${serverIP}/review/selectReview?id=` + reviewModal.selected)
        .then(res => {
          setReview(res.data.review);
          setImg_list(res.data.img_list);
        })
        .catch(err => {
          console.log(err);
        });

      let modal = document.getElementById("review-modal");

      modal.style.opacity = 1;
      modal.style.zIndex = 15;
      modal.style.left = (window.innerWidth - modal.offsetWidth) / 2 + 'px';
      modal.style.top = (window.innerHeight - modal.offsetHeight) / 2 + 'px';

      let clicked = 0;
      let f_x = 0;
      let f_y = 0;
      
      let m_x = 0;
      let m_y = 0;
      
      let c_x = 0;
      let c_y = 0;
      
      let cnt = 0;

      document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
          setReviewModal({ ...reviewModal, isOpen: false });
        }
      });

      if (modal)
        modal.addEventListener("mousedown", (e) => {
          if (clicked === 0) {
            c_x = getNumberFromPixel(modal.style.left);
            c_y = getNumberFromPixel(modal.style.top);
            modal.style.cursor = "grabbing";
            clicked = 1;
          }
          setTimeout(function moveModal() {
            modal.style.left = c_x + m_x - f_x + 'px';
            modal.style.top = c_y + m_y - f_y + 'px';
            c_x = getNumberFromPixel(modal.style.left);
            c_y = getNumberFromPixel(modal.style.top);
            f_x = m_x;
            f_y = m_y;
            setTimeout(moveModal, 10);
            cnt++;
          }, 10);
          window.addEventListener("mouseup", (e) => {
            cnt = 0;
            clicked = 0;
            modal.style.cursor = "grab";
          });
          window.addEventListener("mousemove", (e) => {
            if (clicked === 1) {
              m_x = e.clientX;
              m_y = e.clientY;
              if (cnt < 1000000) {
                cnt = 1000000;
                f_x = e.clientX;
                f_y = e.clientY;
              }
            }
          });
        });

      const modalBackground = document.getElementById("modal-background");
      if(modalBackground)
      modalBackground.style.display = "block";
    }

    return () => {
      const modalBackground = document.getElementById("modal-background");
      if(modalBackground)
      modalBackground.style.display = "none";
    };
  }, []);

  function getNumberFromPixel(_px) {
    if (_px === null || _px === "") {
      return 0;
    }

    _px = _px + "";

    if (_px.indexOf("px") > -1) {
      _px = _px.replace("px", "");
    }

    if (_px.indexOf("PX") > -1) {
      _px = _px.replace("PX", "");
    }

    var result = parseInt(_px, 10);
    if ((result + "") == "NaN") {
      return 0;
    }

    return result;
  }

  const delReview = () => {
    setReviewModal({ ...reviewModal, isOpen: false });
    axios.get(`${serverIP}/review/deleteReview?id=` + review.id)
      .then(res => {
        window.location.reload(true);
      })
      .catch(err => console.log(err));
  };

  const delChk = (bool) => {
    setIsDel(bool);
  };

  const delStyle = {
    position: 'absolute',
    width: '250px',
    height: '200px',
    left: '235px',
    top: '200px',
    backgroundColor: 'white',
    border: '2px solid #b21848',
    borderRadius: '8px'
  };
  
  const delTitleStyle = {
    textAlign: 'center',
    fontSize: '19px',
    margin: '0px 0px 0px 28px',
    lineHeight: '100px'
  };

  const delButtonStyle1 = {
    left: '70px',
    top: '100px'
  };

  const delButtonStyle2 = {
    right: '70px',
    top: '100px'
  };

  return (
    <>
      <div id="modal-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'none',
        backdropFilter: 'blur(5px)',
        zIndex: 14
      }}></div>

      <div id='review-modal'>
        <div id="review-modal-exit" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>X</div>
        {isDel &&
          <div className='review-delete-check' style={delStyle}>
            <span style={delTitleStyle}>정말 삭제하시겠습니까?</span>
            <span style={delButtonStyle1} id='review-del-button' onClick={() => delReview()}>삭제</span>
            <span style={delButtonStyle2} id='review-del-button' onClick={() => delChk(false)}>취소</span>
          </div>
        }
        {review.restaurant !== undefined &&
          <div className='review-modal-box'>
            <div id='review-modal-title'>{review.restaurant.name}</div>
            <div id='review-modal-star'>
              <span className='star-rating'>
                <span style={{ width: `${review.rating * 20}%` }}></span>
              </span> {review.rating}
            </div>
            <span id='review-modal-who'>{review.user.username} / {review.writedate}</span><br />
            <span id='review-modal-cat'>{review.restaurant.categoryOne} / {review.restaurant.location}</span><br />
            <span id='review-modal-comment'>{review.comment}</span><br />
            {
              img_list.map((item) => {
                return (<img id='review-modal-img' src={`${serverIP}/uploads/review/${item.review.id}/${item.filename}`} />);
              })
            }
            <br />
            {((sessionStorage.getItem('id') == review.user.id) || sessionStorage.getItem('loginId')=='admin1234') && <span id='review-del-button' onClick={() => delChk(true)}>삭제</span>}
          </div>
        }
      </div>
    </>
  );
}

export default ReviewModal;