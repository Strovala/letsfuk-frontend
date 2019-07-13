import React, {Component} from 'react';
import StationChat from './StationChat'
import Aux from './../../hoc/Aux';
import axios from 'axios';
import {cookies} from "../../App";
import PrivateChats from "./PrivateChats";

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatList: null,
        };
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getMessages();
        });
    }

    getMessages() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        axios.get('/messages', {headers: {"session-id": sessionId}})
            .then(response => {
                this.setState({chatList: response.data});
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentDidMount() {
        this._ismounted = true;
        this.getMessages();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        if (this.state.chatList) {
            return (
                <Aux>
                    <StationChat
                        {...this.props}
                        chatList={this.state.chatList}
                    />
                    <PrivateChats
                        {...this.props}
                        chatList={this.state.chatList}
                    />
                </Aux>
            );
        }
        return <h1>Loading...</h1>

    }
}

export default ChatList;
