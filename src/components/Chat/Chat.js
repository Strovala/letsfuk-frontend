import React, { Component } from 'react';
import axios from "axios";
import Messages from "./Messages";
import {ActionTypes, Constants, cookies} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";
import SendMessageButton from "./SendMessageButton";
import ScrollMessages from "./ScrollMessages";
import TextInput from "../Inputs/TextInput";
import Loading from "../Loading/Loading";
import {API} from "../../globals/methods";

class Chat extends Component {
    state = {
        text: "",
        limit: Constants.LIMIT
    };

    getMessagesFromBackend() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        API.getMessages({
            sessionId: sessionId,
            receiverId: this.props.receiver.id,
            limit: this.state.limit,
            response: response => {
                let messages = response.data.messages;
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
            }
        });
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

    componentDidUpdate(prevProps) {
        if (prevProps.receiver.id !== this.props.receiver.id)
            this.getMessages();
    }

    handleText(event) {
        this.setState({
            text: event.target.value
        })
    }

    clearText() {
        this.setState({
            text: ""
        })
    }

    handleLimit(value) {
        this.setState({
            limit: value
        })
    }

    render() {
        if (!this.props.chat)
            return <Loading />;
        return (
            <div>
                <ScrollMessages limit={this.state.limit} changeLimit={(value) => this.handleLimit(value)}/>
                <Messages />
                <TextInput value={this.state.text} changed={(event) => this.handleText(event)}/>
                <SendMessageButton text={this.state.text} clearText={() => this.clearText()}/>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        chat: state.activeChat,
        receiver: state.receiver,
        limit: state.limit,
        webSocket: state.webSocket,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeReceiver: (receiver) => dispatch({type: ActionTypes.RECEIVER_CHANGE, receiver: receiver}),
        changeActiveChat: (chat) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, chat: chat})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
