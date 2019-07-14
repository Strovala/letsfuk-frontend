import ChatPreview from "./ChatPreview/ChatPreview";
import React from "react";

const stationChat = (props) => (
    <ChatPreview
        {...props}
        key={props.chats.stationChat.receiverId}
        receiverId={props.chats.stationChat.receiverId}
        messages={props.chats.stationChat.messages}
        lastMessage={props.chats.stationChat.messages[0]}
        unreadCount={props.chats.stationChat.unread}
        isStation={true}
    />
);

export default stationChat;
