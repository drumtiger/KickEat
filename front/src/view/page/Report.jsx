import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { useGlobalState } from "../../GlobalStateContext";

const ReportButton = styled.div`
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
    margin-top:10px;
    font-size:15px;

    &:hover {
        font-weight: bold;
        color:white;
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

function Report({ interact, setReport, setInteract }) {
    const { serverIP } = useGlobalState();
    const [comment, setComment] = useState('');
    const [noMsg, setNoMsg] = useState(false);

    const modalRef = useRef(null);
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const changeComment = (e) => {
        setComment(e.target.value);
    }

    const sendReport = () => {
        if (comment.length === 0) {
            setNoMsg(true);
        }
        else {
            axios.post(`${serverIP}/tech/sendDm`, {
                userFrom: { id: sessionStorage.getItem("id") },
                userTo: { id: interact.selected.id },
                comment: comment,
                state: 2
            })
                .then(res => {
                    if (res.data === 'ok') {
                        setReport(false);
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
                y: e.clientY - modalRef.current.getBoundingClientRect().top + modalRef.current.height/2,
            };
            modalRef.current.style.cursor = "grabbing"; 
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

    return (
        <div
            className='report-container'
            ref={modalRef}
            style={{
                position: 'absolute',
                left: interact.where.pageX - 100, 
                top: interact.where.pageY - 100
            }}
        >
            <div className='report-exit' onClick={() => setReport(false)}>X</div>
            <div className='report-header' style={{ textAlign: 'center', marginTop: '10px' }}>신고하기</div>
            <div className='report-recipient'>
                <h5 className='report-recipient-label' style={{ fontWeight: '600' }}>To.</h5>
                <span className='report-recipient-username'>{interact.selected.username}</span>
                {noMsg && <span className='report-error' style={{ fontSize: '13px', color: 'red', marginLeft: '60px' }}>내용을 입력해주세요</span>}
            </div>
            <textarea className='report-textarea' onChange={changeComment} value={comment} placeholder="내용을 입력해주세요" />
            <ReportButton onClick={sendReport}>전송</ReportButton>
        </div>
    );
}

export default Report;