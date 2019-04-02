import React, {Component} from 'react';

import Aux from '../../hoc/Aux';
import Chat from './Chat/Chat';

class ChatList extends Component {
    state = {
        stationChat: {
            receiverId: "",
            messages: [
                {
                    username: "Vlado",
                    message: "Kako si danas"
                },
                {
                    username: "Zeljko",
                    message: "Cao"
                },
                {
                    username: "Milos",
                    message: "Ima neko fen"
                }
            ]
        },
        privateChats: [
            {
                receiverId: "Vlado",
                messages: [
                    {
                        username: "Kaca",
                        message: "Kako si danas"
                    },
                    {
                        username: "Vlado",
                        message: "Cao"
                    },
                    {
                        username: "Kaca",
                        message: "Kaj se dogaja"
                    }
                ]
            },
            {
                receiverId: "Zeljko",
                messages: [
                    {
                        username: "Zeljko",
                        message: "Kako si danas"
                    },
                    {
                        username: "Kaca",
                        message: "Cao"
                    },
                    {
                        username: "Zeljko",
                        message: "Ajmoooo"
                    }
                ]
            }
        ]
    };

    render() {
        let stationChat = (
            <Chat
                username="Station"
                lastMessage={this.state.stationChat.messages[this.state.stationChat.messages.length-1]}
            />
        );
        let privateChats = this.state.privateChats.map((privateChat) => {
            return <Chat username={privateChat.receiverId} lastMessage={privateChat.messages[privateChat.messages.length-1]}/>
        });
        privateChats = [stationChat, ...privateChats];
        return (
            <Aux>
                { privateChats }
            </Aux>
        );

    }
}

export default ChatList;
