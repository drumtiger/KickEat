"use client"

import { useEffect } from "react"
import Faded from "../../effect/Faded"
import "../../css/user/editConfirm.css"
import confirmimg from "../../img/signupconfirm.png" // Reusing the same image or you can use a different one

function EditConfirm() {
  function goHomePage() {
    window.location.href = "/"
  }

  useEffect(() => {
    // Set a timer to redirect to home page after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = "/"
    }, 2000)

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer)
  }, [])

  return (
    <Faded>
      <div className="editconfirm-container">
        <div id="editconfirm-title">수정 완료</div>
        <div id="imgbox">
          <img src={confirmimg || "/placeholder.svg"} alt="Confirmation" />
        </div>
        <div id="message">
          <p>정보가 성공적으로 수정되었습니다.</p>
          <p>2초 후 홈페이지로 이동합니다...</p>
        </div>
        <div id="buttons">
          <button className="finish-button" onClick={goHomePage}>
            홈페이지로
          </button>
        </div>
      </div>
    </Faded>
  )
}

export default EditConfirm

