import ChatPreview from "./ChatPreview/ChatPreview";
import React from "react";
import {connect} from "react-redux";

const privateChats = (props) => (
    props.chats.privateChats.map((privateChat) => {
        return (
            <ChatPreview
                key={privateChat.receiverId}
                receiverId={privateChat.receiverId}
                messages={privateChat.messages}
                lastMessage={privateChat.messages[0]}
                unreadCount={privateChat.unread}
                isStation={false}
            />
        );
    })
);

const mapStateToProps = state => {
    return {
        chats: state.chats
    }
};

export default connect(mapStateToProps)(privateChats);
