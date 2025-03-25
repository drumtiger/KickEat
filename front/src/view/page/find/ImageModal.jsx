import { useEffect, useState, useRef } from "react";
import { useGlobalState } from "../../../GlobalStateContext";
function ImageModal({ imageList, setImageModal, restaurant }) {
  const { serverIP } = useGlobalState();
  const mount = useRef(true);

  useEffect(() => {
    if (!mount.current) mount.current = false;
    else {
      let modal = document.getElementById("review-image-modal");

      modal.style.opacity = 1;
      modal.style.zIndex = 15;
      modal.style.left = (window.innerWidth - modal.offsetWidth) / 2 + "px";
      modal.style.top = (window.innerHeight - modal.offsetHeight) / 2 + "px";

      let clicked = 0;
      let f_x = 0;
      let f_y = 0;

      let m_x = 0;
      let m_y = 0;

      let c_x = 0;
      let c_y = 0;

      let cnt = 0;

      document.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          setImageModal(false);
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
            modal.style.left = c_x + m_x - f_x + "px";
            modal.style.top = c_y + m_y - f_y + "px";
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
    if (result + "" === "NaN") {
      return 0;
    }

    return result;
  }

  const zoomImage = (item) => {
    let zoom = document.getElementById("zoom");

    zoom.setAttribute(
      "src",
      `${serverIP}/uploads/review/${item.id}/${item.filename}`
    );
    zoom.style.display = "block";
  };

  const imgRender = () => {
    const res = [];
    imageList.forEach((item, idx) => {
      res.push(
        <div id="image-box" key={idx}>
          <img
            src={`${serverIP}/uploads/review/${item.id}/${item.filename}`}
            onClick={() => {
              zoomImage(item);
            }}
          />
          <div>{item.writedate}</div>
        </div>
      );
    });

    return res;
  };

  return (
    <>
      <div
        id="modal-background"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "none",
          backdropFilter: "blur(5px)",
          zIndex: 14,
        }}
      ></div>

      <div id="review-image-modal">
        <div>{restaurant.rstrName}</div>
        <div id="review-image-modal-exit" onClick={() => setImageModal(false)}>
          ×
        </div>

        <div className="gallery-box">{imgRender()}</div>

        <img
          id="zoom"
          onClick={() => {
            document.getElementById("zoom").style.display = "none";
          }}
        />
      </div>
    </>
  );
}

export default ImageModal;