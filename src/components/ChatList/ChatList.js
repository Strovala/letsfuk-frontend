import React, {Component} from 'react';
import ChatPreview from './ChatPreview/ChatPreview';
import Aux from './../../hoc/Aux';
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
