import '../../css/user/signup.css';
import Faded from '../../effect/Faded'
import '../../js/user/signup.js';
import { useEffect, useRef, useState } from 'react';
import Post from './Post.jsx';
import axios from 'axios';
import CheckList from './CheckList.jsx';
import SignUpConfirm from './SignUpConfirm.jsx';
import { useGlobalState } from '../../GlobalStateContext.jsx';

function Signup(){  
    const { serverIP } = useGlobalState();
    const [param, setParam] = useState({});

    const [where, setWhere] = useState(0);

    const [okChk, setOkChk] = useState({
        idOk:false,
        pwOk:false,
        pw_chkOk:false,
        nameOk:false,
        emailOk:false,
        email2Ok:false,
        zipcodeOk:false,
        telOk:false,
        id_alert:'',
        pw_alert:'',
        pw_chk_alert:'',
        name_alert:'',
        email_alert:'',
        zipcode_alert:'',
        addr_alert:'',
        tel_alert:''
    });

    useEffect(() => {
        if(okChk.idOk && okChk.pwOk && okChk.pw_chkOk && okChk.emailOk && okChk.email2Ok && okChk.nameOk && okChk.zipcodeOk && okChk.zipcodeOk) { 

                let userid = document.getElementById("userid");
                let userpw = document.getElementById("userpw");
                let username = document.getElementById("username");
                let email1 = document.getElementById("email1");
                let email2 = document.getElementById("email2");
                let zipcode = document.getElementById('zipcode');
                let addr = document.getElementById("addr");
                let addrdetail = document.getElementById('addrdetail');
                let tel1 = document.getElementById("tel1");
                let tel2 = document.getElementById("tel2");
            let tel3 = document.getElementById("tel3");
            const params = {
                userid:userid.value,
                userpw:userpw.value,
                username:username.value,
                email1:email1.value,
                email2:email2.value,
                zipcode:zipcode.value,
                addr:addr.value,
                addrdetail:addrdetail.value,
                tel1:tel1.value,
                tel2:tel2.value,
                tel3:tel3.value,
                foods:''
            }
            setParam(params);
            console.log(where,"123");
            setWhere(1);
        }
    }, [okChk]);
    
    const [addr, setAddr] = useState({addr:'',});

    const [popup, setPopup] = useState(false);

    const handleComplete = (data) => {
        setPopup(!popup);
    }

    
    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;
        
        setParam(prev=>{
            return{...prev, [name]:value}
        }); 
        if(name === 'userid') {
            if(value.length === 0) setOkChk({...okChk, idOk:false, id_alert:''});
            else if(value.length < 7) 
                setOkChk({...okChk, idOk:false, id_alert:'7자 이상 입력해주세요.'});
            else if(value.length>15) setOkChk({...okChk, idOk:false, id_alert:'15자 이하 입력해주세요.'});
            else {
                axios.post(`${serverIP}/user/idChk`,{userid:value})
                .then(res => {
                    console.log(res.data);
                    if(res.data===1) setOkChk({...okChk, idOk:false, id_alert:'이미 존재하는 아이디입니다.'});
                    else setOkChk({...okChk, idOk:true, id_alert:''});
                })
                .catch(err=>console.log(err))
            }
        }
        else if(name === 'userpw') {
            let pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,15}$/;
            if(!pw_regex.test(value)) setOkChk({...okChk, pwOk:false, pw_alert:'8~15자의 영문,숫자,특수문자의 조합 입력'});
            else setOkChk({...okChk, pwOk:true, pw_alert:''});
        }
        else if(name === 'userpw_chk') {
                if(value !== param.userpw) setOkChk({...okChk, pw_chkOk:false, pw_chk_alert:'비밀번호가 일치하지 않습니다'});
                else setOkChk({...okChk, pw_chkOk:true, pw_chk_alert:''});
        }
        else if(name === 'username') {
            if(value.length < 3) setOkChk({...okChk, nameOk:false, name_alert:'3자 이상 입력해주세요'});
            else if(value.length>8) setOkChk({...okChk, nameOk:false, name_alert:'8자 이하 입력해주세요'});
            else setOkChk({...okChk, nameOk:true, name_alert:''});
        }
        else if(name === 'email1') {
            if(value.length<3) setOkChk({...okChk, emailOk:false, email_alert:'올바르지 않은 이메일입니다. 3자 이상 입력하세요'}); 
            else setOkChk({...okChk, emailOk:true, email_alert:''});
        }
        else if(name === 'email2') {
            let email_regex = /^[A-Za-z0-9-]+\.[A-za-z0-9-]+/;
            if(!email_regex.test(value)) setOkChk({...okChk, email2Ok:false, email_alert:'올바르지 않은 이메일 입니다'}); 
            else setOkChk({...okChk, email2Ok:true, email_alert:''});
        }
     }
    
    function signUpChk(){
        var zipcode = document.getElementById("zipcode");
        
        var tel1 = document.getElementById("tel1");
        var tel2 = document.getElementById("tel2");
        var tel3 = document.getElementById("tel3");
        
        var regex_tel = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        if(!regex_tel.test(tel1.value+'-'+tel2.value+'-'+tel3.value)) setOkChk({...okChk, telOk:false, tel_alert:'올바르지 않은 전화번호 입니다.'}); 
        else if(zipcode.value.length === 0) {
            setOkChk({...okChk, zipcodeOk:false, telOk:true, tel_alert:'', zipcode_alert:'우편번호 찾기를 해주세요'}); 
        }
        else {
            setOkChk({...okChk, zipcodeOk:true, telOk:true, zipcode_alert:'', tel_alert:''}); 
            console.log(okChk);
        }
    }
    const postButtonStyle = {
        position:'absolute',
        top:'8px',
        right:'8px',
        width:'30px',
        height:'30px',
        fontSize:'20px'
    }
    const postBox={
        backgroundColor:'white',
        width:'800px',
        height:'450px',
        position:'fixed',
        left:'50%',
        top:'50%',
        transform:'translate(-50%,-50%)',
        border:'2px solid black',
        borderRadius:'5px'
    }
    return(
        <Faded>
            { where === 0 &&
            <div className="signup-container">
                <div id = "step"><pre></pre>STEP 0{where+1}</div>           
                <div id="signup-title">회원가입</div>
                    <form name="signupForm">
                        <div id="signup-box">
                            <div id="signup-left"><div id="idpw">아이디</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="userid" value={param.userid} onChange={setFormData} name="userid"/><div id="alert-id">{!okChk.idOk && okChk.id_alert}</div></div>
                            <div id="signup-left"><div id="idpw">비밀번호</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="password" style={{width:'38%'}} id="userpw" value={param.userpw} onChange={setFormData} name="userpw"/><div id="alert-pw">{!okChk.pwOk && okChk.pw_alert}</div></div>
                            <div id="signup-left"><div id="idpw">비밀번호확인</div><div id="hidden-height">I</div></div> <div id="signup-right"><input style={{width:'38%'}}type="password" id="userpw_chk" value={param.userpw_chk} onChange={setFormData} name="userpw_chk"/><div id="alert-pwchk">{!okChk.pw_chkOk && okChk.pw_chk_alert}</div></div>
                            <div id="signup-left"><div id="idpw">이름</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="username" value={param.username} onChange={setFormData} name="username"/><div id="alert-name">{!okChk.nameOk && okChk.name_alert}</div></div>
                            <div id="signup-left"><div id="idpw">이메일</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="email1" value={param.email1} onChange={setFormData} name="email1"/> @ <input type="text" id="email2" value={param.email2} onChange={setFormData} name="email2"/><div id="alert-email">{!okChk.emailOk || !okChk.email2Ok ? okChk.email_alert : ''}</div></div>
                            <div id="signup-left"><div id="idpw">전화번호</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="tel1" value={param.tel1} onChange={setFormData} name="tel1" maxLength='3'/> - <input type="text" id="tel2"value={param.tel2} onChange={setFormData} name="tel2" maxLength='4'/> - <input type="text" id="tel3" value={param.tel3} onChange={setFormData} name="tel3" maxLength='4'/><div id="alert-tel">{okChk.tel_alert}</div></div>
                            <div id="signup-left"><div id="idpw">우편번호</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" value={addr.zonecode} onChange={setFormData} id="zipcode" name="zipcode" readOnly/><button className="buttons" type="button" onClick={handleComplete}>찾기</button><div id="alert-zipcode">{okChk.zipcode_alert}</div></div>
                            <div id="signup-left"><div id="idpw">주소</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" value={addr.address} onChange={setFormData} id="addr" name="addr" readOnly/><div id="alert-addr"></div></div>
                            <div id="signup-left"><div id="idpw">상세주소</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="addrdetail" value={param.addrdetail} onChange={setFormData} name="addrdetail"/><div id="alert-addrdetail"></div></div>
                            <div id="signup-left"><div id="idpw"></div></div>

                            {popup && <div style={postBox}>
                                <button title="X" style = {postButtonStyle} onClick={() => setPopup(false)} >X</button> 
                                <Post addr={addr} setAddr={setAddr} setPopup={setPopup}/></div>}
                        </div>
                        <input className="signup-submit" onClick = {signUpChk} type="button" value="다음"/>
                    </form>
                </div>
            }
            {
                where === 1 &&
                <div className="signup-container">           
                    <CheckList param={param} setParam={setParam} where={where} setWhere={setWhere}/>
                </div>
            }
            {
                where === 2 &&
                <div className="signup-container">
                    <SignUpConfirm where={where} setWhere={setWhere}/>
                </div>
            }
        </Faded>
    );
}

export default Signup;