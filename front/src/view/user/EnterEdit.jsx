import {useState,useEffect } from "react";
import Faded from "../../effect/Faded";
import axios from "axios";
import EditPage from "./EditPage";
import EditCheckList from "./EditCheckList";
import ConfirmEdit from "./ConfirmEdit";
import { Link } from "react-router-dom";
import '../../css/user/editEnter.css';
import { useGlobalState } from "../../GlobalStateContext";
function EnterEdit() {
    const { serverIP } = useGlobalState();
    const id = sessionStorage.getItem("id");
    const [data, setData] = useState({});
    const [editWhere, setEditWhere] = useState(0);
    const [editParam, setEditParam] = useState({});
    const [pw, setPw] = useState('');

    useEffect(()=>{
      setData({...data,userid:sessionStorage.getItem("loginId")});
    },[])

    const changePw = (e) => {
        setPw(e.target.value); 
    }

  const editChk = () =>{
    var alert_pw = document.getElementById("alert-pw");
    alert_pw.style.opacity = 0;
    if(pw===''||pw===undefined){
    
    }else{
      axios.post(`${serverIP}/user/editEnterChk`, {
        userid:data.userid,
        userpw:pw
      }).then(res => {
        console.log(res.data)
        if(res.data.id===-1){
            console.log("아이디오류");
        }else if(res.data.id=== -2){
          console.log("비밀번호 오류");
          alert_pw.innerHTML = "비밀번호를 확인하세요(8~15글자,영문,숫자,특수문자)";
          alert_pw.style.opacity = 1;
        }else{
         setEditParam(res.data);
         setEditWhere(1);
        }
      })
      .catch(err => console.log(err))  
    }
  }

  return (
    <Faded>
      {editWhere === 0 &&
    <div className="editEnter-container">
        <div id="editEnter-title">개인정보 수정</div>
        <form name="editEnterForm" method="post" onSubmit={(e) => { e.preventDefault(); editChk() }}>    
            <div id="editEnter-box">
                <div id="editEnter-left"><div id="idpw">아이디</div><div id="hidden-height">I</div></div> <div id="editEnter-right">{sessionStorage.getItem('loginId')}<div id="alert-pw"></div></div>
                <div id="editEnter-left"><div id="idpw">비밀번호</div><div id="hidden-height">I</div></div> <div id="editEnter-right"><input value={pw} type="password" id="userpw" name="userpw" onChange={changePw}/><div id="alert-pw"></div></div>
            </div>
            <input className="editEnter-submit" type='button' onClick={()=>editChk()} value="비밀번호 확인"/>
        </form>
    </div>
}
{editWhere === 1 &&
  <div>
    <EditPage editParam={editParam} setEditParam={setEditParam} editWhere={editWhere} setEditWhere={setEditWhere}/>
  </div>
}
{editWhere === 2 &&
  <div>
    <EditCheckList editParam={editParam} setEditParam={setEditParam} editwhere={editWhere} setEditWhere={setEditWhere}/>
  </div>
}
{
  editWhere === 3 &&
  <ConfirmEdit/>
}
</Faded>
  );
}
export default EnterEdit; 