import React, { Component } from 'react';

import Aux from '../../../hoc/Aux';
import classes from './Chat.css';
import axios from "axios";

class Chat extends Component {
    state = {
        sender: null,
        user: null
    };

    componentDidMount() {
        axios.get('/users/' + this.props.lastMessage.senderId, { headers: { "session-id": this.props.user.sessionId } })
            .then(response => {
                this.setState({sender: response.data});
            })
            .catch(error => {
                console.log(error);
            });
        if (this.props.userId === "Station") {
            this.setState({user: {username: "Station"}});
            return;
        }
        axios.get('/users/' + this.props.userId, { headers: { "session-id": this.props.user.sessionId } })
            .then(response => {
                this.setState({user: response.data});
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
