import React, { Component } from 'react';
import axios from "axios";
import Aux from './../../hoc/Aux';
import {Constants, cookies} from "../../App";
import Messages from "./Messages";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            messages: null,
            text: "",
            offset: 0,
            limit: Constants.LIMIT
        };
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getMessages();
        });
    };

    getMessagesFromBackend(receiverId, sessionId) {
        axios.get(
            `/messages/${receiverId}?limit=${this.state.limit}&offset=${this.state.offset}`,
            {headers: {"session-id": sessionId}}
        )
            .then(response => {
                let messages = response.data.messages.reverse();
                this.setState({
                    messages: messages
                });
            })
    }

    resetUnreadMessages() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        let stationId, senderId;
        if (this.props.isStation) {
            stationId = this.state.id;
        } else {
            senderId = this.state.id;
        }
        let data = {
            station_id: stationId,
            sender_id: senderId,
            count: 0,
        };
        axios.put('/messages/unreads/reset', data, {headers: {"session-id": sessionId}})
            .then(response => {

            });
    }

    getMessages() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        let receiverId;
        if (this.props.isStation) {
            let userId = this.props.getUserId();
            axios.get(`users/${userId}/station`, {headers: {"session-id": sessionId}})
                .then(response => {
                    receiverId = response.data.stationId;
                    this.setState({id: receiverId});
                    this.getMessagesFromBackend(receiverId, sessionId);
                    this.resetUnreadMessages();
                });
            return;
        }
        receiverId = this.props.receiver.userId;
        this.setState({id: receiverId});
        this.getMessagesFromBackend(receiverId, sessionId);
        this.resetUnreadMessages();
    }

    componentDidMount() {
        this._ismounted = true;
        this.getMessages();
    }

    componentWillUnmount() {
        this._ismounted = false;
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
            .catch(error => {
                console.log(error.response.data);
            })
    }

    render() {
        if (this.state.messages) {
            return (
                <Aux>
                    <Messages {...this.props} messages={this.state.messages}/>
                    <input type="text" value={this.state.text} onChange={(event) => this.handleText(event)} />
                    <button onClick={(event) => this.sendMessage(event)}>Send</button>
                </Aux>
            );
        }
        return <h1>Loading...</h1>;
    }
}

export default Chat;
