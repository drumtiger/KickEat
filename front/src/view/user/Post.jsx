import DaumPostcode from "react-daum-postcode";

const Post = (props) => {
    const complete = (data) =>{
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        props.setAddr({
            ...props.addr,
            address:fullAddress,
            zonecode:data.zonecode
        })
        props.setPopup(false);
    }

    return (
            <DaumPostcode style={{width:'800px'}}
                className="postmodal"
                autoClose
                onComplete={complete} />
    );
};

export default Post;