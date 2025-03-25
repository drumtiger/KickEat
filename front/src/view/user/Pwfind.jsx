import { useState } from "react";
import Faded from "../../effect/Faded";
import { Link } from "react-router-dom";
import axios from "axios";
import '../../css/user/pwfind.css';

function Pwfind() {
  const [pwFindParam, setPwFindParam] = useState({});
  const [okChk, setOkChk] = useState({
    idOk:false,
    emailOk: false,
    email2Ok: false,
    email_alert: "",
  });

  function setFormData(e) {
    let name = e.target.name;
    let value = e.target.value;
    setPwFindParam((prev) => {
      return { ...prev, [name]: value };
    });
    if (name === "userid") {
        if(value.length === 0) setOkChk({...okChk, idOk:false, id_alert:''});
        else if(value.length < 7) 
            setOkChk({...okChk, idOk:false, id_alert:'7자 이상 입력해주세요.'});
        else if(value.length>15) setOkChk({...okChk, idOk:false, id_alert:'15자 이하 입력해주세요.'});
        else setOkChk({...okChk, idOk:true, id_alert:''});
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

  const pwFindChk = (event) => {
    event.preventDefault();
    if(okChk.idOk === false){
      alert("아이디를 확인하세요");
      return;
  }else if(okChk.emailOk === false || okChk.email2Ok === false){
      alert("이메일을 확인하세요");
      return;
  }
    let userid = document.getElementById("userid");
    let email1 = document.getElementById("email1");
    let email2 = document.getElementById("email2");
    const pwFindParam = {
        userid:userid.value,
        email1:email1.value,
        email2:email2.value
    }
    axios
      .post("http://localhost:9977/user/pwFind", pwFindParam)
      .then((res) => {
        console.log(res.data);
        if (res.data.pw === -1) {
          alert("일치하는 정보가 없습니다.");
        } else {
          if(res.data.userpw === undefined) alert("해당하는 사용자가 없습니다.");
          else alert("비밀번호는 " + res.data.userpw + "입니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Faded>
      <div className="pwfind-container">
        <div id="pwfind-title">비밀번호 찾기</div>
        <form
          name="pwFindForm"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            pwFindChk();
          }}
        >
          <div id="pwfind-box">
            <div id="pwfind-left">
              <div id="pwfind">아이디</div>
              <div id="hidden-height">I</div>
            </div>
            <div id="pwfind-right">
              <input type="text" id="userid" name="userid" onChange={setFormData} />
              <div id="alert-id">{!okChk.idOk && okChk.id_alert}</div>
            </div>
            <div id="pwfind-left">
              <div id="pwpwfind">이메일</div>
              <div id="hidden-height">I</div>
            </div>
            <div id="pwfind-right">
              <input type="text" id="email1" onChange={setFormData} name="email1" /> @{" "}
              <input type="text" id="email2" onChange={setFormData} name="email2" />
              <div id="alert-email">{!okChk.emailOk || !okChk.email2Ok ? okChk.email_alert : ""}</div>
            </div>
          </div>
          <input className="pwfind-submit" onClick={pwFindChk} type="button" value="비밀번호 찾기" />
          <div id="idpw-find">
            <div id="pw-find">
              <Link to="/idfind">아이디 찾기</Link>
            </div>
          </div>
        </form>
      </div>
    </Faded>
  );
}
export default Pwfind;