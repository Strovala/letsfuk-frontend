import React  from 'react';
import Avatar from "../Message/Avatar"
import {connect} from "react-redux";

const message = (props) => {
    const formatSentAt = (dateString) => {
        const date = new Date(dateString);
        // Returns offset in minutes
        const offset = new Date().getTimezoneOffset()/60;
        const hours = date.getHours() - offset;
        const minutes = date.getMinutes();
        const formattedMinutes = ("0" + minutes).slice(-2);
        return `${hours}:${formattedMinutes}`
    };
    let text = props.message.text + " at " + formatSentAt(props.message.sentAt);
    let userId = props.user.user.userId;
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
