import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dm from "./Dm";
import Report from './Report';

function Interact({ interact, setInteract }) {
    const [dm, setDm] = useState(false);
    const [report, setReport] = useState(false);
    const prevInteractRef = useRef(interact);

    const navigate = useNavigate();

    useEffect(() => {
        prevInteractRef.current = interact;
    }, [interact]);

    const closePopup = () => {
        setInteract((prevState) => ({ ...prevState, isOpen: false }));
    };

    const moveInfo = (where) => {
        navigate('/userInfo', {state:where});
        setInteract({...interact, isOpen:false});
    }

    return (
        <>
            {dm && !report && <Dm interact={interact} setDm={setDm} setInteract={setInteract}/>}
            {report && !dm && <Report interact={interact} setReport={setReport} setInteract={setInteract}/>}
            
            {interact.isOpen && (
                <div className="interact-popup" style={{ left: interact.where.pageX, top: interact.where.pageY }}>
                    <div className="interact-exit" onClick={closePopup}>X</div>
                    <ul className="interact-list">
                        <li className="interact-item" onClick={()=> moveInfo(interact.selected)}>정보 보기</li>
                        <li className="interact-item" onClick={() => !report && sessionStorage.getItem("loginStatus") == 'Y' && setDm(true)}>쪽지 보내기</li>
                        <li className="interact-item" onClick={() => !dm && sessionStorage.getItem("loginStatus") == 'Y' && setReport(true)}>신고 하기</li>
                    </ul>
                </div>
            )}
        </>
    );
}

export default Interact;