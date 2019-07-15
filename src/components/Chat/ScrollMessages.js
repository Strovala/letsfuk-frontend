import React from "react";
import {ActionTypes, Constants} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";
import {API} from "../../globals/methods";

const scrollMessages = (props) => (
    <button onClick={() => {
        let limit = props.limit + Constants.LIMIT;
        API.getMessages({
            user: props.user,
            receiverId: props.receiver.id,
            limit: limit,
            response: response => {
                let messages = response.data.messages;
                props.changeActiveChat({
                    ...props.chat,
                    messages: messages
                });
                props.changeLimit(limit);
            }
        });
    }}>Scroll</button>
);

const mapStateToProps = state => {
    return {
        chat: state.activeChat,
        user: state.user,
        receiver: state.receiver
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeActiveChat: (chat) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, chat: chat})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(scrollMessages);
