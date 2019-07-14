import ChatPreview from "./ChatPreview/ChatPreview";
import React from "react";
import {connect} from "react-redux";

const privateChats = (props) => (
    props.chats.map((privateChat) => {
        return (
            <ChatPreview
                key={privateChat.receiver.id}
                chat={privateChat}
            />
        );
    })
);

const mapStateToProps = state => {
    return {
        chats: state.chats.privateChats
    }
};

export default connect(mapStateToProps)(privateChats);
