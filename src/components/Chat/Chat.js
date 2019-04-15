import React, { Component } from 'react';
import Message from "./Message/Message";
import axios from "axios";
import Aux from './../../hoc/Aux';
import {Constants, cookies} from "../../App";

class Chat extends Component {
    state = {
        messages: null,
        text: "",
        offset: 0,
        limit: Constants.LIMIT
    };


    getMessages() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        axios.get(
            `/messages/${this.props.receiverId}?limit=${this.state.limit}&offset=${this.state.offset}`,
            {headers: {"session-id": sessionId}}
        )
            .then(response => {
                let messages = response.data.messages.reverse();
                this.setState({
                    messages: messages
                });
            })
            .catch(error => {
                console.log(error.response.data);
            })
    }

    componentDidMount() {
        this.setState({
            messages: this.props.messages.reverse()
        });
    }

    handleText(event) {
        this.setState({
            text: event.target.value
        });
    }

    sendMessage(event) {
        let data = {
            "text": this.state.text
        };
        if (!this.props.isStation) {
            data['user_id'] = this.props.receiver.userId;
        }
        this.setState({text: ""});
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        axios.post('/messages', data, {headers: {"session-id": sessionId}})
            .then(response => {
                this.getMessages();
            })
            .catch(error => {
                console.log(error.response.data);
            })
    }

    render() {
        if (this.state.messages) {
            let messages = this.state.messages.map((message) => {
                return (
                    <Message
                        {...this.props}
                        key={message.messageId}
                        receiverId={message.receiverId}
                        senderId={message.senderId}
                        text={message.text}
                        sentAt={message.sentAt}
                    />
                );
            });
            return (
                <Aux>
                    <div>
                        {messages}
                    </div>
                    <input type="text" value={this.state.text} onChange={(event) => this.handleText(event)} />
                    <button onClick={(event) => this.sendMessage(event)}>Send</button>
                </Aux>
            );
        }
        return <h1>Loading...</h1>;
    }
}

export default Chat;