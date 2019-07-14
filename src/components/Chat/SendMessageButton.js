import React from "react";
import {ActionTypes, cookies} from "../../globals/constants";
import axios from "axios";
import connect from "react-redux/es/connect/connect";


const sendMessageButton = (props) => (
    <button onClick={() => {
        let data = {
            "text": props.text
        };
        if (!props.receiver.isStation) {
            data['user_id'] = props.receiver.userId;
        }
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = props.user.sessionId;
        }
        axios.post('/messages', data, {headers: {"session-id": sessionId}})
        props.clearText();
    }}>Send</button>
);

const mapStateToProps = state => {
    return {
        receiver: state.activeChat.receiver,
        user: state.user,
        text: state.text,
        limit: state.limit,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        clearText: () => dispatch({type: ActionTypes.TEXT_CHANGE, text: ""}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(sendMessageButton);