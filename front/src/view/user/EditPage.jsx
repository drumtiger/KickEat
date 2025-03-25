import { useState, useEffect } from 'react';
import Post from './Post';
import Faded from '../../effect/Faded'
import '../../css/user/editPage.css';


function EditPage({editParam, setEditParam, editWhere, setEditWhere}) {



const [okChk, setOkChk] = useState({
        idOk:false,
        pwOk:true,
        pw_chkOk:true,
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
      if(okChk.zipcodeOk && okChk.zipcodeOk) { 
              let user_no = sessionStorage.getItem('id');
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
          const editParam = {
              id:sessionStorage.getItem('id'),
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
          
          setEditParam(editParam);
          setEditWhere(2);
         
      }else{
        setEditWhere(1);
      }
  }, [okChk]);
  
  const [addr, setAddr] = useState({address:editParam.addr, zonecode:editParam.zipcode});
  const [popup, setPopup] = useState(false);

  const handleComplete = (data) => {
      setPopup(!popup);
  }

  
  function setFormData(event){
      let name = event.target.name;
      let value = event.target.value;
      
      setEditParam(prev=>{
          return{...prev, [name]:value}
      }); 
     
     if(name === 'userpw') {
          let pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,15}$/;
          if(!pw_regex.test(value)) setOkChk({...okChk, pwOk:false, pw_alert:'8~15자의 영문,숫자,특수문자의 조합 입력'});
          else setOkChk({...okChk, pwOk:true, pw_alert:''});
      }
      
   }
  
  function editPageChk(){
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

  return (
    <div className="editPage-container" style={{paddingTop:'150px'}}>
                <div id="editPage-title">개인정보수정</div>
                    <form name="editPageForm">
                        <div id="editPage-box">
                            <div id="editPage-left"><div id="editidpw">아이디</div><div id="hidden-height111">I</div></div> <div id="editPage-right"><input type="text" id="userid" value={editParam.userid} readOnly onChange={setFormData} name="userid"/><div id="alert-id">{!okChk.idOk && okChk.id_alert}</div></div>
                            <input type="hidden" id="userpw" value={editParam.userpw} onChange={setFormData} name="userpw"/>
                            <div id="editPage-left"><div id="editidpw">이름</div><div id="hidden-height">I</div></div> <div id="editPage-right"><input type="text" id="username" value={editParam.username} readOnly onChange={setFormData} name="username"/><div id="alert-name">{!okChk.nameOk && okChk.name_alert}</div></div>
                            <div id="editPage-left"><div id="editidpw">이메일</div><div id="hidden-height">I</div></div> <div id="editPage-right"><input type="text" id="email1" value={editParam.email1} readOnly onChange={setFormData} name="email1"/> @ <input type="text" id="email2" value={editParam.email2} readOnly onChange={setFormData} name="email2"/><div id="alert-email">{!okChk.emailOk || !okChk.email2Ok ? okChk.email_alert : ''}</div></div>
                            <div id="editPage-left"><div id="editidpw">전화번호</div><div id="hidden-height">I</div></div> <div id="editPage-right"><input type="text" id="tel1" value={editParam.tel1} onChange={setFormData} readOnly name="tel1" maxLength='3'/> - <input type="text" id="tel2" readOnly value={editParam.tel2} onChange={setFormData} name="tel2" maxLength='4'/> - <input type="text" id="tel3" readOnly value={editParam.tel3} onChange={setFormData} name="tel3" maxLength='4'/><div id="alert-tel">{okChk.tel_alert}</div></div>
                            <div id="editPage-left"><div id="editidpw">우편번호</div><div id="hidden-height">I</div></div> <div id="editPage-right"><input type="text" value={addr.zonecode} onChange={setFormData} id="zipcode" name="zipcode" /><button className="buttons" type="button" onClick={handleComplete}>찾기</button><div id="alert-zipcode">{okChk.zipcode_alert}</div></div>
                            <div id="editPage-left"><div id="editidpw">주소</div><div id="hidden-height">I</div></div> <div id="editPage-right"><input type="text" value={addr.address} onChange={setFormData} id="addr" name="addr" readOnly/><div id="alert-addr"></div></div>
                            <div id="editPage-left"><div id="editidpw">상세주소</div><div id="hidden-height">I</div></div> <div id="editPage-right"><input type="text" id="addrdetail" value={editParam.addrdetail} onChange={setFormData} name="addrdetail"/><div id="alert-addrdetail"></div></div>
                            <div id="editPage-left"><div id="editidpw"></div></div>

                            {popup && <div style={postBox}>
                                <button title="X" style = {postButtonStyle} onClick={() => setPopup(false)} >X</button> 
                                <Post addr={addr} setAddr={setAddr} setPopup={setPopup}/></div>}
                        </div>
                        <input className="editPage-submit" onClick = {editPageChk} type="button" value="다음"/>
                    </form>
                </div>
  );
}
export default EditPage;