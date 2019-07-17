import React from 'react';
import Message from "./Message/Message";
import {connect} from "react-redux";

const messages = (props) => (
    props.chat.messages.map((message) => {
        return (
            <Message
                key={message.messageId}
                message={message}
            />
        );
    })
);

const mapStateToProps = state => {
    return {
        chat: state.activeChat,
    }
};

export default connect(mapStateToProps)(messages);
