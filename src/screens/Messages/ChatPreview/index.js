import React from "react";
import {connect} from "react-redux";
import {ActionTypes, Screens} from "../../../globals/constants";
import {
    formatSentAtForChatList,
    trimLastMessageText
} from "../../../globals/methods";
import Avatar from '../../../components/Avatar';
import '../Messages.scss';
import Aux from "../../../components/hoc/Aux";

const chatPreview = (props) => {
    let lastMessage = props.chat.messages[props.chat.messages.length - 1];
    let unread = null;
    let unreadClass = "";
    if (props.chat.unread) {
        unread = (
            <div className="chat-preview__unread">{props.chat.unread}</div>
        );
        unreadClass = "chat-preview--unread";
    }
    let messageText = null;
    if (!lastMessage.imageKey) {
        messageText = lastMessage.text;
        if (props.chat.receiver.isStation) {
            messageText = `${lastMessage.sender.username}: ${messageText}`;
        }
        messageText = trimLastMessageText(messageText, 20);
    } else {
        messageText = <i className="fas fa-image" />;
        if (props.chat.receiver.isStation) {
            messageText = (
                <Aux>
                    {`${lastMessage.sender.username}: `} {messageText}
                </Aux>
            )
        }
    }
    return (
        <div className={`chat-preview ${unreadClass}`} ref={(el) => props.setRef ? props.setRef(el): null} onClick={() => {
            props.changeActiveChat(props.chat);
            props.changeReceiver(props.chat.receiver);
            props.changeScreen(Screens.CHAT);
        }}>
            <Avatar className="chat-preview__avatar" iconClassName={props.iconClassName} avatarKey={props.chat.receiver.avatarKey} />
            <div className="chat-preview__message">
                <div className="chat-preview__receiver" >{props.chat.receiver.username}</div>
                <div className="chat-preview__message-text">
                    {messageText}
                </div>
            </div>
            <div className="chat-preview__time">{formatSentAtForChatList(lastMessage.sentAt)}</div>
            {unread}
        </div>
    )
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(chatPreview);