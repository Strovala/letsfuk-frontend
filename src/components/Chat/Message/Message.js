import React  from 'react';
import Avatar from "../Message/Avatar"
import connect from "react-redux/es/connect/connect";

const message = (props) => {
    let text = props.message.text + " at " + props.message.sentAt;
    let userId = props.user.userId;
    let avatar = <Avatar sender={props.message.sender}/>;
    let message = (
        <div>
            {avatar}: {text}
        </div>
    );
    if (props.message.sender.userId === userId) {
        message = (
            <div>
                {text} :{avatar}
            </div>
        );
    }
    return message;
};

const mapStateToProps = state => {
    return {
        user: state.user,
    }
};

export default connect(mapStateToProps)(message);
