import React, { Component } from 'react';

import Aux from '../../../hoc/Aux';
import classes from './Chat.css';
import axios from "axios";
import humps from "humps";

class Chat extends Component {
    state = {
        sender: null,
        user: null,
        sessionId: "f45d6095-4410-4411-a521-5262b8fe6980"
    };

    componentDidMount() {
        axios.get('http://localhost:8888/users/' + this.props.lastMessage.senderId, { headers: { "session-id": this.state.sessionId } })
            .then(response => {
                console.log(response.data);
                let sender = {...response.data};
                sender = humps.camelizeKeys(sender);
                this.setState({sender: sender});
            })
            .catch(error => {
                console.log(error);
            });
        if (this.props.userId === "Station") {
            this.setState({user: {username: "Station"}})
            return;
        }
        axios.get('http://localhost:8888/users/' + this.props.userId, { headers: { "session-id": this.state.sessionId } })
            .then(response => {
                console.log(response.data);
                let user = {...response.data};
                user = humps.camelizeKeys(user);
                this.setState({user: user});
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        if (this.state.sender && this.state.user) {
            let lastMessageText = null;
            if (this.props.lastMessage) {
                lastMessageText =
                    <p>{this.state.sender.username}: {this.props.lastMessage.text}</p>
            }
            return (
                <Aux>
                    <p>{this.state.user.username}</p>
                    <span
                        className={classes.avatar}
                        style={{backgroundColor: '#777'}}
                    />
                    {lastMessageText}
                </Aux>
            );
        }
        return <p>Loading ...</p>
    }
}

export default Chat;
