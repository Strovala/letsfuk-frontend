import React, {Component} from 'react';
import ChatPreview from './ChatPreview/ChatPreview';
import Aux from './../../hoc/Aux';
import axios from 'axios';
import {cookies} from "../../App";

class ChatList extends Component {
    state = {
        chatList: null,
    };

    componentDidMount() {
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

        let that = this;
        this.props.webSocket.bind('message', function (data) {
            let isStation = data.isStation;
            let chatList = {...that.state.chatList};
            if (isStation) {
                // chatList.stationChat.unreadMessagesCount = 0;
                // Here is the part to show unreadMessages
            }
        });
    }

    render() {
        if (this.state.chatList) {
            let stationMessages = this.state.chatList.stationChat.messages;
            let stationChat = (
                <ChatPreview
                    {...this.props}
                    key={this.state.chatList.stationChat.receiverId}
                    receiverId={this.state.chatList.stationChat.receiverId}
                    messages={stationMessages}
                    isStation={true}
                />
            );
            let privateChats = this.state.chatList.privateChats.map((privateChat) => {
                return (
                    <ChatPreview
                        {...this.props}
                        key={privateChat.receiverId}
                        receiverId={privateChat.receiverId}
                        messages={privateChat.messages}
                        isStation={false}
                    />
                );
            });
            privateChats = [stationChat, ...privateChats];
            return (
                <Aux>
                    {privateChats}
                </Aux>
            );
        }
        return <h1>Loading...</h1>

    }
}

export default ChatList;
