let lastScrollY=0;
window.addEventListener('DOMContentLoaded', ()=>{
    let header=document.getElementsByClassName('header');
    let menu_button=document.getElementsByClassName('menu-button');
    let menu_list= document.getElementsByClassName('menu-list');
    window.addEventListener('scroll', () => {
        const offset = 80;
        let curScrollY=window.scrollY;
        if(curScrollY - lastScrollY > 0) {
            if(curScrollY >= offset) {
                if(header && menu_button) {
                    header[0].style.transform = "rotateX(90deg)";
                    menu_button[0].style.right= "-43px";
                }
            }
        } else {
            if(curScrollY <= offset) {
                if(header && menu_button && menu_list){
                    header[0].style.transform = "rotateX(0deg)";
                    menu_button[0].style.right= "-90px";
                    //menu_list[0].style.right = "0px";
                }
            }
        }
        lastScrollY=curScrollY;
    })
});