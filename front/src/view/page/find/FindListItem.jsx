import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "../../../GlobalStateContext";

function FindListItem({restaurant}) {
    const { serverIP } = useGlobalState();
    const [wish, setWish] = useState('');
    const category = ['한식','패스트푸드','일식','중식','아시아음식','양식','주점','분식','뷔페','기타'];
    const categoryColor = [
        "rgba(200, 230, 201, 0.25)",  // 한식
        "rgba(255, 204, 128, 0.25)",  // 패스트푸드
        "rgba(174, 213, 255, 0.25)",  // 일식
        "rgba(255, 183, 77, 0.25)",   // 중식
        "rgba(179, 229, 252, 0.25)",  // 아시아음식
        "rgba(255, 236, 179, 0.25)",  // 양식
        "rgba(255, 204, 188, 0.25)",  // 주점
        "rgba(225, 190, 231, 0.25)",  // 분식
        "rgba(255, 245, 157, 0.25)",  // 뷔페
        "rgba(197, 202, 233, 0.25)"   // 기타
    ]
      
    
    
    useEffect(()=> {
        if (sessionStorage.getItem("id") != null) {
            axios.post(`${serverIP}/tech/getWishState`, {
                restaurant: {id: restaurant.id},
                user: {id: sessionStorage.getItem("id")}
            })
            .then(res => {
                setWish(res.data);
            })
            .catch(err => console.log(err));
        }
    },[])

    useEffect(() => {
        const items = document.getElementsByClassName("find-list-item");
    
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const categoryOne = item.getAttribute('data-category');
    
            const categoryIndex = category.indexOf(categoryOne);
            item.style.background = categoryColor[categoryIndex];
        }
    }, []);

    const wait = (ms) => {
        return new Promise(res=>setTimeout(res,ms));
    }

    const favorite = async(e)=> {
        axios.post(`${serverIP}/tech/wishlist`, {
            restaurant: {id: restaurant.id},
            user: {id: sessionStorage.getItem("id")},
            state: e.target.innerText
        })
        .then(res=>{
            setWish(res.data.state);
        })
        .catch(err=>{
            console.log(err);
        });

        e.target.style.scale = '1.4';
        await wait(500);
        e.target.style.scale = '1.0';
    }

    return (
            <div className="find-list-item" data-category={restaurant.categoryOne} style={{position: 'relative'}}>
                <div id="list-favorite" onClick={favorite}>{wish}</div>
                <div className="list-item-img"
                    style={{background:`url(${'/img/find/'+restaurant.categoryOne+'.png'}) center / 100%`}}>
                </div>
                <div>
                    <Link to={'/findInfo'} state={{id: restaurant.id}}>
                        <div id="rstr-name">{restaurant.name}</div>
                    </Link>
                    <div id="rstr-location">{restaurant.location.substring(6)}</div>
                    <div>
                        <span className='star-rating'>
                            <span style ={{width:`${restaurant.rating*20}%`}}></span>
                        </span>
                        <span> ({Math.ceil(restaurant.rating*100)/100}) /</span>&nbsp;{restaurant.reviewCount}명 참여</div>
                    <div>👁 {restaurant.hit} / ♥ {restaurant.wishCount}</div>
                </div>
            </div>
        
    )
}

export default FindListItem;