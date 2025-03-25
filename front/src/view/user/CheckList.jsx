import { useState } from 'react';
import '../../css/user/checklist.css';
import axios from 'axios';
import Faded from '../../effect/Faded';
import Signup from './Singup';
import Login from './Login';
import { useGlobalState } from '../../GlobalStateContext';

function CheckList({param, setParam, where, setWhere}){
    const { serverIP } = useGlobalState();
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const allFoods = ["한식","중국식","일식","양식","아시아음식","패스트푸드","주점","뷔페","패밀리레스트랑","기타"];
    
    const handleCheckBox = (event) =>{
        const {value,checked} = event.target;
        if(checked){
            setSelectedFoods([...selectedFoods, value]);
        }else{
            setSelectedFoods(selectedFoods.filter((item) => item !== value));
            setAllChecked(false);
        }
    }

    const allCheckedHandler = (event) =>{
        setAllChecked(event.target.checked);
        if(event.target.checked){
            setSelectedFoods(allFoods);
        }else{
            setSelectedFoods([]);
        }
    }

    const handleSubmit =(event)=>{
        event.preventDefault();
        console.log(param);
        const foodsString = selectedFoods.length > 0 ? selectedFoods.join('/') : '';

        console.log("보내는거", foodsString);
        setParam({...param, foods:foodsString});
        
        axios.post(`${serverIP}/user/checkList`,{...param, foods:foodsString})
        .then(response =>{
            console.log('보냄',response.data);
            setWhere(2);
            <Signup where={where} setWhere={setWhere}/>
        })
        .catch(error =>{
            console.log("안보내지미",error);
        })
    }

    function prevPage(){
        setWhere(0);
        <Signup param={param} setParam={setParam} where={where} setWhere={setWhere}/>
    }
    
  
    return (
        <Faded>
            
        <div className="checklist-container">
        <div id = "step"><pre></pre>STEP 0{where+1}</div>
          <div id="checklist-title">선호음식</div>
          <form id="checklistForm" name="checklistForm" onSubmit={handleSubmit}>
            <div className="all-select-wrapper">
              <label className="all-select-label">
                <input type="checkbox" checked={allChecked} onChange={allCheckedHandler} />
                <span className="label-text">전체선택</span>
              </label>
            </div>
            <div id="boxes">
              {allFoods.map((food) => (
                <label key={food} className="food-select">
                  <input
                    type="checkbox"
                    checked={allChecked || selectedFoods.includes(food)}
                    value={food}
                    onChange={handleCheckBox}
                  />
                  <span className="food-name">{food}</span>
                </label>
              ))}
            </div>
            <div id="buttons" >
            <button className="save-button" onClick={prevPage}>이전으로</button>
            <button type="submit" className="save-button">
              저장!
            </button>
            </div>
          </form>
        </div>
        </Faded>
      )
}
export default CheckList;