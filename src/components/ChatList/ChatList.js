import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Chat from './Chat/Chat';
import axios from 'axios';

class ChatList extends Component {
    state = {
        chatList: null,
    };

    componentDidMount() {
        axios.get('/messages', {headers: {"session-id": this.props.user.sessionId}})
            .then(response => {
                this.setState({chatList: response.data});
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        if (this.state.chatList) {
            console.log(this.props.context);
            let lastMessage = null;
            if (this.state.chatList.stationChat.messages.length > 0) {
                lastMessage = this.state.chatList.stationChat.messages[this.state.chatList.stationChat.messages.length - 1]
            }
            let stationChat = (
                <Chat
                    {...this.props}
                    key={"Station"}
                    userId="Station"
                    lastMessage={lastMessage}
                />
            );
            let privateChats = this.state.chatList.privateChats.map((privateChat) => {
                return <Chat
                    {...this.props}
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
