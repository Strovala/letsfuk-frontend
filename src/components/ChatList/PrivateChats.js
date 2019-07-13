import ChatPreview from "./ChatPreview/ChatPreview";
import React from "react";

const privateChats = (props) => (
    props.chatList.privateChats.map((privateChat) => {
        return (
            <ChatPreview
                {...props}
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

export default privateChats;
