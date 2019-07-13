import ChatPreview from "./ChatPreview/ChatPreview";
import React from "react";

const stationChat = (props) => (
    <ChatPreview
        {...props}
        key={props.chatList.stationChat.receiverId}
        receiverId={props.chatList.stationChat.receiverId}
        messages={props.chatList.stationChat.messages}
        lastMessage={props.chatList.stationChat.messages[0]}
        unreadCount={props.chatList.stationChat.unread}
        isStation={true}
    />
);

export default stationChat;
