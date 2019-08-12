import React, {Component, useState} from "react";
import {connect} from "react-redux";
import {ActionTypes, Screens} from "../../../globals/constants";
import {API, formatSentAtForMessage} from "../../../globals/methods";
import Avatar from "../../../components/Avatar";

class MessagePreview extends Component {
    state = {
        imgUrl: null,
    };

    componentDidMount() {
        if (this.props.message.imageKey) {
            API.getPhotoUrl({
                user: this.props.user,
                data: {
                    key: this.props.message.imageKey
                }
            })
                .then(response => {
                    this.setState({
                        imgUrl: response.data.url
                    })
                });
        }
    }

    render() {
        const selfClass = this.props.message.sender.userId === this.props.user.user.userId ? "message--self" : "";
        const currentMessageSenderId = this.props.message.sender.userId;
        const prevMessageSenderId = this.props.prevMessage ? this.props.prevMessage.sender.userId : null;
        const privateClass = !this.props.receiver.isStation ? "message--private" : "";
        const sameClass = !(this.props.receiver.isStation && currentMessageSenderId !== prevMessageSenderId) ? "message--same" : "";
        let content = <div
            className="message__text">{this.props.message.text}</div>;
        if (this.props.message.imageKey) {
            content = (
                <div className="message__img"
                     onClick={(event) => {
                         this.props.imageClick(this.state.imgUrl)
                     }}
                     style={{backgroundImage: `url(${this.state.imgUrl})`}}/>
            );
        }
        return (
            <div
                className={`message ${selfClass} ${privateClass} ${sameClass}`}
                ref={(el) => this.props.setRef(el)}>
                <Avatar className="message__avatar" iconClassName="fas fa-user"
                        avatarKey={this.props.message.sender.avatarKey}/>
                <div className="message__box">
                    <div className="message__sender" onClick={() => {
                        const receiver = this.props.message.sender;
                        receiver.id = receiver.userId;
                        this.props.changeReceiver(receiver);
                        this.props.changeScreen(Screens.CHAT);
                    }}>{this.props.message.sender.username}</div>
                    {content}
                    <div
                        className="message__time">{formatSentAtForMessage(this.props.message.sentAt)}</div>
                </div>
            </div>
        )
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(MessagePreview);
