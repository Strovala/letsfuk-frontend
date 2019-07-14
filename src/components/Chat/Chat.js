import React, { Component } from 'react';
import axios from "axios";
import Messages from "./Messages";
import {ActionTypes, cookies} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";
import SendMessageButton from "./SendMessageButton";
import MessageText from "./MessageText";
import ScrollMessages from "./ScrollMessages";

class Chat extends Component {

    getMessagesFromBackend() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        axios.get(
            `/messages/${this.props.receiver.id}?limit=${this.props.limit}`,
            {headers: {"session-id": sessionId}}
        )
            .then(response => {
                let messages = response.data.messages;
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
            })
    }

    resetUnreadMessages(stationId, senderId) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        let data = {
            station_id: stationId,
            sender_id: senderId,
            count: 0,
        };
        axios.put('/messages/unreads/reset', data, {headers: {"session-id": sessionId}})
    }

    getMessages() {
        this.getMessagesFromBackend();

        if (this.props.receiver.isStation)
            this.resetUnreadMessages(this.props.receiver.id, undefined);
        else {
            this.resetUnreadMessages(undefined, this.props.receiver.id);
        }
    }

    componentDidMount() {
        this._ismounted = true;
        this.getMessages();
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getMessages();
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <ScrollMessages />
                <Messages />
                <MessageText />
                <SendMessageButton />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        chat: state.activeChat,
        receiver: state.activeChat.receiver,
        text: state.text,
        limit: state.limit,
        webSocket: state.webSocket,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeText: (text) => dispatch({type: ActionTypes.TEXT_CHANGE, text: text}),
        changeLimit: (limit) => dispatch({type: ActionTypes.LIMIT_CHANGE, limit: limit}),
        clearText: () => dispatch({type: ActionTypes.TEXT_CHANGE, text: ""}),
        changeReceiver: (receiver) => dispatch({type: ActionTypes.RECEIVER_CHANGE, receiver: receiver}),
        changeActiveChat: (chat) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, chat: chat})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
