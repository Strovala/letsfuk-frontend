import React from "react";
import {connect} from "react-redux";
import {ActionTypes, Screens} from "../../../globals/constants";
import {formatSentAtForMessage} from "../../../globals/methods";
import Avatar from "../../../components/Avatar";

const messagePreview = (props) => {
    const selfClass = props.message.sender.userId === props.user.user.userId ? "message--self": "";
    const currentMessageSenderId = props.message.sender.userId;
    const prevMessageSenderId = props.prevMessage ? props.prevMessage.sender.userId: null;
    const privateClass = !props.receiver.isStation ? "message--private": "";
    const sameClass = !(props.receiver.isStation && currentMessageSenderId !== prevMessageSenderId) ? "message--same": "";
    let content = <div className="message__text">{props.message.text}</div>;
    if (props.message.isImage) {
        const imgUrl = "https://img.dxcdn.com/productimages/sku_94630_1.jpg";
        content = (
            <div className="message__img"
                 onClick={(event) => {
                     props.imageClick(imgUrl)
                 }}
                 style={{backgroundImage: `url(${imgUrl})`}}/>
        );
    }
    return (
        <div className={`message ${selfClass} ${privateClass} ${sameClass}`} ref={(el) => props.setRef(el)}>
            <Avatar className="message__avatar" iconClassName="fas fa-user" avatarKey={props.message.sender.avatarKey} />
            <div className="message__box">
                <div className="message__sender" onClick={() => {
                    const receiver = props.message.sender;
                    receiver.id = receiver.userId;
                    props.changeReceiver(receiver);
                    props.changeScreen(Screens.CHAT);
                }}>{props.message.sender.username}</div>
                {content}
                <div className="message__time">{formatSentAtForMessage(props.message.sentAt)}</div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        user: state.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(messagePreview);
