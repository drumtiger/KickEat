import { useState } from "react";
import Faded from "../../effect/Faded";
import { Link } from "react-router-dom";
import axios from "axios";
import '../../css/user/idfind.css';

function Idfind() {
  const [idFindParam, setIdFindParam] = useState({});
  const [okChk, setOkChk] = useState({
    nameOk: false,
    emailOk: false,
    email2Ok: false,
    email_alert: "",
  });

  function setFormData(e) {
    let name = e.target.name;
    let value = e.target.value;
    setIdFindParam((prev) => {
      return { ...prev, [name]: value };
    });
    if (name === "username") {
      if (value.length < 3)
        setOkChk({ ...okChk, emailOk: false, email_alert: "이름은 3글자 이상 입력하세요" });
      else if (value.length > 8)
        setOkChk({ ...okChk, nameOk: false, name_alert: "8자 이하 입력해주세요" });
      else setOkChk({ ...okChk, nameOk: true, name_alert: "" });
    } else if (name === "email1") {
      if (value.length < 3)
        setOkChk({ ...okChk, emailOk: false, email_alert: "올바르지 않은 이메일입니다" });
      else setOkChk({ ...okChk, emailOk: true, email_alert: "" });
    } else if (name === "email2") {
      let email_regex = /^[A-Za-z0-9-]+\.[A-za-z0-9-]+/;
      if (!email_regex.test(value))
        setOkChk({ ...okChk, email2Ok: false, email_alert: "올바르지 않은 이메일 입니다" });
      else setOkChk({ ...okChk, email2Ok: true, email_alert: "" });
    }
  }

  const idFindChk = (event) => {
    event.preventDefault();
    if(okChk.nameOk === false){
        alert("이름을 확인하세요");
        return;
    }else if(okChk.emailOk === false || okChk.email2Ok === false){
        alert("이메일을 확인하세요");
        return;
    }
    let username = document.getElementById("username");
    let email1 = document.getElementById("email1");
    let email2 = document.getElementById("email2");
    const idFindParam = {
        username:username.value,
        email1:email1.value,
        email2:email2.value
    }
    axios
      .post("http://localhost:9977/user/idFind", idFindParam)
      .then((res) => {
        console.log(res.data);
        if (res.data.id === -1) {
          alert("일치하는 정보가 없습니다.");
        } else if (res.data.id === 'undefined'||res.data.id === null || res.data.id === "") {
          alert("일치하는 정보가 없습니다.");

        }else {
          if(res.data.userid === undefined) alert("해당하는 사용자가 없습니다.");
          else alert("아이디는 " + res.data.userid + "입니다.");
          <Link to="/login" />;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Faded>
      <div className="idfind-container">
        <div id="idfind-title">아이디 찾기</div>
        <form
          name="idFindForm"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            idFindChk();
          }}
        >
          <div id="idfind-box">
            <div id="idfind-left">
              <div id="idpwfind">이름</div>
              <div id="hidden-height">I</div>
            </div>
            <div id="idfind-right">
              <input type="text" id="username" name="username" onChange={setFormData} />
              <div id="alert-id"></div>
            </div>
            <div id="idfind-left">
              <div id="idpwfind">이메일</div>
              <div id="hidden-height">I</div>
            </div>
            <div id="idfind-right">
              <input type="text" id="email1" onChange={setFormData} name="email1" /> @{" "}
              <input type="text" id="email2" onChange={setFormData} name="email2" />
              <div id="alert-email">{!okChk.emailOk || !okChk.email2Ok ? okChk.email_alert : ""}</div>
            </div>
          </div>
          <input className="idfind-submit" onClick={idFindChk} type="button" value="아이디찾기" />
          <div id="idpw-find">
            <div id="pw-find">
              <Link to="/pwfind">비밀번호찾기</Link>
            </div>
          </div>
        </form>
      </div>
    </Faded>
  );
}
export default Idfind;