import Faded from "../../effect/Faded";
import '../../css/user/signupconfirm.css';
import { useEffect } from "react";
import confirmimg from '../../img/signupconfirm.png'

function SignUpConfirm(where, setWhere){
    function goHomePage(){
        window.location.href='/';
    }
    function goLoginPage(){
        window.location.href='#/Login';
    }
    useEffect(()=>{console.log(where)},[])

    return(
        <Faded>
            <div className="signupconfirm-container">
                <div id = "step"><pre></pre>STEP 0{(where.where+1)}</div>
                <div id="signupconfirm-title">회원가입완료</div>
                <div id="imgbox"><img src={confirmimg}/></div>
                <div id="buttons">
                <button className="finish-button" onClick={goHomePage}>홈페이지로</button>
                <button className="finish-button" onClick={goLoginPage}>로그인페이지로</button>
                </div>
            </div>
        </Faded>
    )
}
export default SignUpConfirm;