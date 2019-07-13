import React, { Component } from 'react';

import Aux from '../../../hoc/Aux';
import axios from "axios";
import {cookies, Screens} from "../../../App";

class ChatPreview extends Component {
    state = {
        lastMessageSender: null,
        receiver: null
    };

    componentDidMount() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        axios.get('/users/' + this.props.lastMessage.senderId, { headers: { "session-id": sessionId } })
            .then(response => {
                this.setState({lastMessageSender: response.data});
            });
        if (this.props.isStation) {
            return;
        }
        axios.get('/users/' + this.props.receiverId, { headers: { "session-id": sessionId } })
            .then(response => {
                this.setState({receiver: response.data});
            })
    }

    enterChat(event) {
        this.props.changeReceiver(this.state.receiver);
        this.props.changeIsStation(this.props.isStation);
        this.props.changeScreen(Screens.CHAT);
    }

    render() {
        if (
            !(!this.props.isStation && this.state.lastMessageSender && this.state.receiver) &&
            !(this.props.isStation && this.state.lastMessageSender)
        )
            return null;
        let lastMessageText = null;
        if (this.props.lastMessage) {
            lastMessageText =
                <p>{this.state.lastMessageSender.username}: {this.props.lastMessage.text}</p>
        }
        let username = "Station";
        if (!this.props.isStation) {
            username = this.state.receiver.username;
        }
        if (this.props.unreadCount)
            username += " " + this.props.unreadCount;
        return (
            <Aux>
                <div onClick={(event) => this.enterChat()}>
                    {username}
                    {lastMessageText}
                </div>
            </Aux>
        );
    }
}

export default ChatPreview;
