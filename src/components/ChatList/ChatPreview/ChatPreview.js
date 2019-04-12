import React, { Component } from 'react';

import Aux from '../../../hoc/Aux';
import axios from "axios";
import {Screens} from "../../../App";

class ChatPreview extends Component {
    state = {
        lastMessageSender: null,
        receiver: null,
        lastMessage: this.props.messages[0]
    };

    componentDidMount() {
        axios.get('/users/' + this.state.lastMessage.senderId, { headers: { "session-id": this.props.user.sessionId } })
            .then(response => {
                this.setState({lastMessageSender: response.data});
            })
            .catch(error => {
                console.log(error);
            });
        if (this.props.isStation) {
            return;
        }
        axios.get('/users/' + this.props.receiverId, { headers: { "session-id": this.props.user.sessionId } })
            .then(response => {
                this.setState({receiver: response.data});
            })
            .catch(error => {
                console.log(error);
            })
    }

    enterChat(event) {
        let additionalProps = {...this.props};
        additionalProps.receiver = this.state.receiver;
        this.props.changeScreen(Screens.CHAT, additionalProps);
    }

    render() {
        if (
            !(!this.props.isStation && this.state.lastMessageSender && this.state.receiver) &&
            !(this.props.isStation && this.state.lastMessageSender)
        )
            return <p>Loading ...</p>;
        let lastMessageText = null;
        if (this.state.lastMessage) {
            lastMessageText =
                <p>{this.state.lastMessageSender.username}: {this.state.lastMessage.text}</p>
        }
        let username = "Station";
        if (!this.props.isStation) {
            username = <p>{this.state.receiver.username}</p>;
        }
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
