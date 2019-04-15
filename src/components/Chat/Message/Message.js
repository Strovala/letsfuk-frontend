import React, { Component } from 'react';
import axios from "axios";
import {cookies} from "../../../App";

class Message extends Component {
    state = {
        sender: null
    };

    componentDidMount() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        axios.get(`/users/${this.props.senderId}`, { headers: { "session-id": sessionId } })
            .then(response => {
                this.setState({sender: response.data});
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        if (!this.state.sender) {
            return null;
        }
        let text = this.props.text + " at " + this.props.sentAt;
        if (this.state.sender.userId === this.props.user.user.userId) {
            text = `${text} :${this.state.sender.username}`;
        } else {
            text = `${this.state.sender.username}: ${text}`;
        }
        return (
            <div>
                {text}
            </div>
        );
    }
}

export default Message;