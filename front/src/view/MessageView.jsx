import { useRef, useEffect } from "react";
import axios from 'axios';
import { useGlobalState } from "../GlobalStateContext";

function MessageView({msg_box, setMsg_box}) {
    const { serverIP } = useGlobalState();
    const mount = useRef(true);

    useEffect(() => {
        if (!mount.current) mount.current = false;
        else {
            let modal = document.getElementsByClassName("message-view-container")[0];

            modal.style.opacity = 1;
            modal.style.zIndex = 13;
            modal.style.left = (window.innerWidth - modal.offsetWidth) / 2 + 'px';
            modal.style.top = (window.innerHeight - modal.offsetHeight) / 2 + 'px';

            let clicked = 0;
            let f_x = 0;
            let f_y = 0;

            let m_x = 0;
            let m_y = 0;

            let c_x = 0;
            let c_y = 0;

            let cnt = 0;

            document.addEventListener('keyup', (e) => {
                if (e.key === 'Escape') {
                    setMsg_box({ ...msg_box, isOpen: false });
                }
            });

            if (modal)
                modal.addEventListener("mousedown", (e) => {
                    if (clicked === 0) {
                        c_x = getNumberFromPixel(modal.style.left);
                        c_y = getNumberFromPixel(modal.style.top);
                        modal.style.cursor = "grabbing";
                        clicked = 1;
                    }
                    setTimeout(function moveModal() {
                        modal.style.left = c_x + m_x - f_x + 'px';
                        modal.style.top = c_y + m_y - f_y + 'px';
                        c_x = getNumberFromPixel(modal.style.left);
                        c_y = getNumberFromPixel(modal.style.top);
                        f_x = m_x;
                        f_y = m_y;
                        setTimeout(moveModal, 10);
                        cnt++;
                    }, 10);
                    window.addEventListener("mouseup", (e) => {
                        cnt = 0;
                        clicked = 0;
                        modal.style.cursor = "grab";
                    });
                    window.addEventListener("mousemove", (e) => {
                        if (clicked === 1) {
                            m_x = e.clientX;
                            m_y = e.clientY;
                            if (cnt < 1000000) {
                                cnt = 1000000;
                                f_x = e.clientX;
                                f_y = e.clientY;
                            }
                        }
                    });
                });
        }
    }, []);

    function getNumberFromPixel(_px) {
        if (_px === null || _px === "") {
            return 0;
        }

        _px = _px + "";

        if (_px.indexOf("px") > -1) {
            _px = _px.replace("px", "");
        }

        if (_px.indexOf("PX") > -1) {
            _px = _px.replace("PX", "");
        }

        var result = parseInt(_px, 10);
        if ((result + "") == "NaN") {
            return 0;
        }

        return result;
    }

    const readMessage = (id) => {
        const det = document.getElementById('comment-detail-' + id);
        if (det.style.display === 'inline-block') det.style.display = 'none';
        else det.style.display = 'inline-block';
        axios.post(`${serverIP}/tech/readMessage`, { id: id })
            .then(res => {
                setMsg_box({ ...msg_box, msg_list: res.data });
            })
            .catch(err => console.log(err))
    }

    const readReport = (id) => {
        const det = document.getElementById('comment-detail-' + id);
        if (det.style.display === 'inline-block') det.style.display = 'none';
        else det.style.display = 'inline-block';
    }

    const delMsg = (id) => {
        axios.post(`${serverIP}/tech/deleteMessage`, { id: id })
            .then(res => {
                setMsg_box({ ...msg_box, msg_list: res.data });
            })
            .catch(err => console.log(err))
    }

    const delReport = (id) => {
        axios.post(`${serverIP}/tech/deleteReport`, { id: id })
            .then(res => {
                setMsg_box({ ...msg_box, msg_list: res.data });
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            {/* Background Layer with Blur Effect */}
            <div id="modal-background" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: msg_box.isOpen ? 'block' : 'none', // Show/Hide based on modal state
                backdropFilter: 'blur(5px)',
                zIndex: 12
            }}></div>

            <div className='message-view-container'>
                <div id="message-view-exit" onClick={() => setMsg_box({ ...msg_box, isOpen: false })}>×</div>
                {sessionStorage.getItem('loginId') !== 'admin1234' ?
                    <div style={{ textAlign: 'center', fontSize: '24px' }}>쪽지 보관함</div> :
                    <div style={{ textAlign: 'center', fontSize: '24px' }}>신고 목록</div>
                }
                {sessionStorage.getItem('loginId') !== 'admin1234' ?
                    <ul className='msg-ul'>
                        <li>날짜</li>
                        <li style={{ paddingLeft: '10px' }}>내용</li>
                        <li>보낸이</li>
                        <li></li>
                    </ul>
                    : <ul className='msg-ul'>
                        <li>날짜</li>
                        <li style={{ paddingLeft: '10px', width: '40%' }}>내용</li>
                        <li style={{ width: '15%' }} i>보낸이</li>
                        <li style={{ width: '15%' }}>신고대상</li>
                        <li></li>
                    </ul>
                }
                {
                    msg_box.msg_list.map((item) => {
                        return (
                            <>
                                {
                                    sessionStorage.getItem('loginId') === 'admin1234' ?
                                        <>
                                            <ul>
                                                <li>
                                                    {item.writedate.substring(0, 10)}
                                                </li>
                                                <li className='msg-comm' style={{ cursor: 'pointer', paddingLeft: '10px', width: '40%' }} onClick={() => readReport(item.id)}>
                                                    {item.comment}
                                                </li>
                                                <li style={{ width: '15%', cursor: 'pointer' }} id={`mgw-${item.userFrom.id}`}
                                                    className="msg-who">
                                                    {item.userFrom.username}
                                                </li>
                                                <li style={{ width: '15%', cursor: 'pointer' }} id={`mgw-${item.userTo.id}`}
                                                    className="msg-who">
                                                    {item.userTo.username}
                                                </li>
                                                <li id='view-del-btn' onClick={() => delReport(item.id)}>
                                                    X
                                                </li>
                                            </ul>
                                            <div className='comment-detail' id={'comment-detail-' + item.id} style={{ display: 'none' }}>
                                                {item.comment}
                                            </div>
                                        </> :
                                        item.state !== 2 &&
                                        <>
                                            <ul>
                                                <li style={item.state !== 0 ? { color: 'gray' } : {}}>
                                                    {item.writedate.substring(0, 10)}
                                                </li>
                                                <li className='msg-comm' style={item.state === 0 ? { cursor: 'pointer' } : { cursor: 'pointer', color: 'gray' }} onClick={() => readMessage(item.id)}>
                                                    {item.comment}
                                                </li>
                                                <li style={item.state !== 0 ? { color: 'gray', cursor: 'pointer' } : { cursor: 'pointer' }} id={`mgw-${item.userFrom.id}`} className="msg-who">
                                                    {item.userFrom.username}
                                                </li>
                                                <li id='view-del-btn' onClick={() => delMsg(item.id)}>
                                                    X
                                                </li>
                                            </ul>
                                            <div className='comment-detail' id={'comment-detail-' + item.id} style={{ display: 'none' }}>
                                                {item.comment}
                                            </div>
                                        </>
                                }
                            </>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default MessageView;