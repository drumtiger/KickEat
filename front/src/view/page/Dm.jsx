import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { useGlobalState } from "../../GlobalStateContext";

function Dm({ interact, setInteract, setDm }) {
    const [comment, setComment] = useState('');
    const [noMsg, setNoMsg] = useState(false);
    const { serverIP } = useGlobalState();

    const modalRef = useRef(null);
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const changeComment = (e) => {
        setComment(e.target.value);
    }

    const sendDm = () => {
        if (comment.length === 0) {
            setNoMsg(true);
        }
        else {
            axios.post(`${serverIP}/tech/sendDm`, {
                userFrom: { id: sessionStorage.getItem("id") },
                userTo: { id: interact.selected.id },
                comment: comment
            })
                .then(res => {
                    if (res.data === 'ok') {
                        setDm(false);
                        setInteract({ ...interact, isOpen: false });
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const onMouseDown = (e) => {
        if (modalRef.current) {
            isDragging.current = true;
            offset.current = {
                x: e.clientX - modalRef.current.getBoundingClientRect().left,
                y: (e.clientY - modalRef.current.getBoundingClientRect().top)+modalRef.current.height/2,
            };
            modalRef.current.style.cursor = "grabbing"; // 커서 변경
        }
    };

    const onMouseMove = (e) => {
        if (isDragging.current && modalRef.current) {
            const x = e.clientX - offset.current.x;
            const y = e.clientY - offset.current.y;
            modalRef.current.style.left = `${x}px`;
            modalRef.current.style.top = `${y}px`;
        }
    };

    const onMouseUp = () => {
        if (isDragging.current && modalRef.current) {
            isDragging.current = false;
            modalRef.current.style.cursor = "grab";
        }
    };

    useEffect(() => {
        const modal = modalRef.current;

        if (modal) {
            modal.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }

        return () => {
            if (modal) {
                modal.removeEventListener('mousedown', onMouseDown);
            }
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const DmButton = styled.div`
        position: relative;
        font-family: "IBM Plex Sans KR", sans-serif;
        height: 26px;
        line-height: 26px;
        padding: 4px 10px;
        border: 2px solid #b21848;
        font-weight: bold;
        font-size: 12px;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        width: auto;
        color: #b21848;
        background-color: transparent;
        transition: all 0.3s ease-in-out;
        margin-top: 10px;
        font-size: 15px;

        &:hover {
            font-weight: bold;
            color: white;
        }

        &:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0%;
            height: 100%;
            border-radius: 1px;
            transition: all 0.3s ease-in-out;
            opacity: 0;
            background-color: #b21848;
            z-index: -1;
        }

        &:hover:after {
            width: 100%;
            opacity: 1;
        }
    `;

    return (
        <div
            className='dm-container'
            ref={modalRef}
            style={{ left: interact.where.pageX - 100, top: interact.where.pageY - 100 }}
        >
            <div className='dm-exit' onClick={() => setDm(false)}>X</div>
            <div className='dm-header'>쪽지 보내기</div>
            <div className='dm-recipient'>
                <h5 className='dm-recipient-label'>To.</h5>
                <span className='dm-recipient-username'>{interact.selected.username}</span>
                {noMsg && <span className='dm-error'>내용을 입력해주세요</span>}
            </div>
            <textarea className='dm-textarea' onChange={changeComment} value={comment} placeholder="내용을 입력해주세요" />
            <DmButton onClick={sendDm}>전송</DmButton>
        </div>
    );
}

export default Dm;