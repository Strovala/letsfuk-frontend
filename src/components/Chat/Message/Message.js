import React, { Component } from 'react';
import axios from "axios";

class Message extends Component {
    state = {
        receiver: null
    };

    componentDidMount() {
        let userId = this.props.receiverId;
        if (this.props.receiver.username === 'Station') {
            userId = this.props.senderId;
        }
        axios.get('/users/' + userId, { headers: { "session-id": this.props.user.sessionId } })
            .then(response => {
                this.setState({receiver: response.data});
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        if (this.state.receiver) {
            let text = this.props.text + " at " + this.props.sentAt;
            if (this.props.user && this.props.senderId === this.props.user.user.userId) {
                text = text + " :" + this.props.user.user.username;
            } else {
                text = this.state.receiver.username + ": " + text;
            }
            return (
                <div>
                    {text}
                </div>
            );
        }
        return <h1>Loading ...</h1>
    }
}

export default Message;