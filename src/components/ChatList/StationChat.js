import ChatPreview from "./ChatPreview/ChatPreview";
import React from "react";
import connect from "react-redux/es/connect/connect";

const stationChat = (props) => (
    <ChatPreview
        key={props.chat.receiverId}
        id={props.chat.receiverId}
        messages={props.chat.messages}
        lastMessage={props.chat.messages[0]}
        unreadCount={props.chat.unread}
        isStation={true}
    />
);

const mapStateToProps = state => {
    return {
        chat: state.chats.stationChat
    }
};

export default connect(mapStateToProps)(stationChat);