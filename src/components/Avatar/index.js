import React, {useState} from "react";
import {API} from "../../globals/methods";
import {connect} from "react-redux";

const avatar = (props) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    let avatarStyle = null;
    let avatarClass = "";
    if (avatarUrl) {
        avatarClass = `${props.className}--user-img`;
        avatarStyle = {
            backgroundImage: `url(${avatarUrl})`
        }
    }
    if (props.avatarKey) {
        API.getPhotoUrl({
            user: props.user,
            data: {
                key: props.avatarKey
            }
        })
            .then(response => {
                setAvatarUrl(response.data.url)
            })
    }
    return (
        <div className={`${props.className} ${avatarClass}`} style={avatarStyle}>
            <i className={props.iconClassName}/>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(avatar);