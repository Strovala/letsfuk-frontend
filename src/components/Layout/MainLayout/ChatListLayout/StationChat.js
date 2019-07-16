import ChatPreview from "./ChatPreview";
import React from "react";
import {connect} from "react-redux";

const stationChat = (props) => (
    <ChatPreview
        key={props.chat.receiver.id}
        chat={props.chat}
    />
);

const mapStateToProps = state => {
    return {
        chat: state.chats.stationChat
    }
};

export default connect(mapStateToProps)(stationChat);
