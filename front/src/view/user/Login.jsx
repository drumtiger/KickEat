import { useState } from 'react';
import axios from 'axios';
import '../../css/user/login.css';
import { Link } from 'react-router-dom';
import Faded from '../../effect/Faded'
import { useGlobalState } from '../../GlobalStateContext';

function Login(){
    const { serverIP } = useGlobalState();
    const [data, setData] = useState({});

    const setFormData = (e) => {
        setData(p => {
            return {...p, [e.target.name]:e.target.value}
        })
    }

    const doLogin = (dt) => {
        sessionStorage.setItem("loginStatus", "Y");
        sessionStorage.setItem("loginName",dt.username);
        sessionStorage.setItem("loginId",dt.userid);
        sessionStorage.setItem("id", dt.id);

        window.location.href = "/";
    }

    const loginChk = () => {
        var userid = data.userid;
        var userpw = data.userpw;
        var alert_id = document.getElementById("alert-id");
        var alert_pw = document.getElementById("alert-pw");
        alert_id.style.opacity = 0;
        alert_pw.style.opacity = 0;
        
        if(userid==="" || userid===undefined) {
            alert_id.innerHTML = "아이디를 입력하세요";
            alert_id.style.opacity = 1;
        }
        else if(userpw===""||userpw===undefined){
            alert_pw.innerHTML = "비밀번호를 입력하세요";
            alert_pw.style.opacity = 1;
        }
        else{
            axios.post(`${serverIP}/user/loginChk`, {
                userid:userid,
                userpw:userpw
            }).then(res => {
                if(res.data.id===-1){
                    alert_id.innerHTML = "아이디를 확인하세요";
                    alert_id.style.opacity = 1;
                } else if(res.data.id===-2){
                    alert_pw.innerHTML = "비밀번호를 확인하세요(8~15글자,영문,숫자,특수문자)";
                    alert_pw.style.opacity = 1;
                } else{
                    doLogin(res.data);
                }		
            })
            .catch(err => console.log(err))
        }
    }

    return(
        <Faded>
            <div className="login-container">
                <div id="login-title">로그인</div>
                <form name="loginForm" method="post" onSubmit={(e) => { e.preventDefault(); loginChk() }}>                    <div id="signup-box">
                        <div id="login-left"><div id="idpw">아이디</div><div id="hidden-height">I</div></div> <div id="login-right"><input style={{width:'40%'}} type="text" id="userid" name="userid" onChange={setFormData}/><div id="alert-id"></div></div>
                        <div id="login-left"><div id="idpw">비밀번호</div><div id="hidden-height">I</div></div> <div id="login-right"><input style={{width:'40%'}} type="password" id="userpw" name="userpw" onChange={setFormData}/><div id="alert-pw"></div></div>
                    </div>
                    <input className="login-submit" type="submit" value="로그인"/>
                    <div id="login-idpw-find">
                        <div id="login-id-find"><Link to="/idfind">아이디찾기</Link></div>
                        <div id="login-pw-find"><Link to="/pwfind">비밀번호찾기</Link></div>
                    </div>
                </form>
            </div>
        </Faded>
    );
}

export default Login;