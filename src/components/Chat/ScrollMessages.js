import React from "react";
import {ActionTypes, Constants, cookies} from "../../globals/constants";
import axios from "axios";
import connect from "react-redux/es/connect/connect";

const scrollMessages = (props) => (
    <button onClick={() => {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = props.user.sessionId;
        }
        let limit = props.limit + Constants.LIMIT;
        axios.get(
            `/messages/${props.receiver.id}?limit=${limit}`,
            {headers: {"session-id": sessionId}}
        )
            .then(response => {
                let messages = response.data.messages;
                props.changeActiveChat({
                    ...props.chat,
                    messages: messages
                });
                props.changeLimit(limit);
            })
    }}>Scroll</button>
);

const mapStateToProps = state => {
    return {
        user: state.user,
        limit: state.limit,
        receiver: state.activeChat.receiver
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeLimit: (limit) => dispatch({type: ActionTypes.LIMIT_CHANGE, limit: limit}),
        changeActiveChat: (chat) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, chat: chat})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(scrollMessages);
