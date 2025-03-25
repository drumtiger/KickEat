import React from 'react';
import { Link,useLocation} from 'react-router-dom';
import '../css/footer.css';
import kakaoIcon from '../img/footer_kakao.png';
import instaIcon from '../img/footer_insta.png';
import facebookIcon from '../img/footer_facebook.png';

function Footer({ loginStatus, contextPath }) {
    if (loginStatus === 'A') {
        return null;
    }
    return (
        <ul className="footer">
            <li className="footer-info">
                <h3>(주)KickEat</h3>
                <ul>
                    <li>대표 : 쩝쩝박사</li>
                    <li>사업자번호 : 123-45-67890</li>
                    <li>Tel : <a href="tel:010-0000-0000">010-0000-0000</a></li>
                    <li>서울특별시 성동구 아차산로 113, 2층</li>
                    <li><a href="mailto:kickeat@gmail.com">kickeat@gmail.com</a></li>
                </ul>
            </li>
            <li className="footer-links">
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link to="/terms-of-use">Site Terms of Use</Link></li>                   
             </li>
                <li className="footer-icons">
                    <a href="https://www.kakao.com" target="_blank" rel="noopener noreferrer">
                        <img src={kakaoIcon} alt="Kakao" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={instaIcon} alt="Instagram" />
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={facebookIcon} alt="Facebook" />
                    </a>
                </li>
            <li className="footer-copyright">
                Copyright ⓒ 2025 KickEat Inc. All rights reserved.
            </li>
        </ul>
    );
}

export default Footer;