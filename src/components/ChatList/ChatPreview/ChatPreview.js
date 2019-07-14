import React  from 'react';

import {ActionTypes, Screens} from "../../../globals/constants";
import connect from "react-redux/es/connect/connect";

const chatPreview = (props) => {
    let lastMessageText = null;
    let lastMessage = props.chat.messages[props.chat.messages.length-1];
    if (lastMessage) {
        lastMessageText = `${lastMessage.sender.username}: ${lastMessage.text}`
    }
    let username = props.chat.receiver.username;
    if (props.chat.unread)
        username = `${username} ${props.chat.unread}`;
    return (
        <div onClick={() => {
            props.changeActiveChat(props.chat);
            props.changeScreen(Screens.CHAT)
        }}>
            <div>
                {username}
            </div>
            <div>
                {lastMessageText}
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeReceiver: (receiver) => dispatch({type: ActionTypes.RECEIVER_CHANGE, receiver: receiver}),
        changeActiveChat: (chat) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, chat: chat})
    }
};

export default connect(null, mapDispatchToProps)(chatPreview);
