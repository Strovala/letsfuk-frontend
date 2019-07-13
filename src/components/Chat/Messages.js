import React from 'react';
import Message from "./Message/Message";

const messages = (props) => (
    props.messages.map((message) => {
        return (
            <Message
                {...props}
                key={message.messageId}
                receiverId={message.receiverId}
                senderId={message.senderId}
                text={message.text}
                sentAt={message.sentAt}
            />
        );
    })
);

export default messages;
