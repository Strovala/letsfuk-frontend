import React, { Component } from 'react';
import axios from "axios";
import {cookies, Screens} from '../../../globals/constants';
import Avatar from "../Message/Avatar"

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
    }

    avatarClicked(event) {
        console.log(event);
        this.props.changeReceiver(this.state.sender);
        this.props.changeIsStation(false);
        this.props.changeScreen(Screens.CHAT);
    }

    render() {
        if (!this.state.sender) {
            return null;
        }
        let text = this.props.text + " at " + this.props.sentAt;
        let userId = this.props.getUserId();
        let avatar = <Avatar avatarClicked={() => this.avatarClicked(this.state.sender)} value={this.state.sender.username}/>;
        let message = (
            <div>
                {avatar}: {text}
            </div>
        );
        if (this.state.sender.userId === userId) {
            message = (
                <div>
                    {text} :{avatar}
                </div>
            );
        }
        return message;
    }
}

export default Message;