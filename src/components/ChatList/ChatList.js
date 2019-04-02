import React, {Component} from 'react';
import humps from 'humps';
import Aux from '../../hoc/Aux';
import Chat from './Chat/Chat';
import axios from 'axios';

class ChatList extends Component {
    state = {
        chatList: null,
        sessionId: "f45d6095-4410-4411-a521-5262b8fe6980"
    };

    componentDidMount() {
        axios.get('http://localhost:8888/messages', { headers: { "session-id": this.state.sessionId } })
            .then(response => {
                console.log(response.data);
                let chatList = {...response.data};
                chatList = humps.camelizeKeys(chatList);
                this.setState({chatList: chatList});
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        if (this.state.chatList) {
            let lastMessage = null;
            if (this.state.chatList.stationChat.messages.length > 0) {
                lastMessage = this.state.chatList.stationChat.messages[this.state.chatList.stationChat.messages.length - 1]
            }
            let stationChat = (
                <Chat
                    key={"Station"}
                    userId="Station"
                    lastMessage={lastMessage}
                />
            );
            let privateChats = this.state.chatList.privateChats.map((privateChat) => {
                return <Chat
                    key={privateChat.receiverId}
                    userId={privateChat.receiverId}
                    lastMessage={privateChat.messages[privateChat.messages.length - 1]}
                />
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
