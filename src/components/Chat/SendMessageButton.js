import React from "react";
import {cookies} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";
import {API} from "../../globals/methods";


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
        API.sendMessage({
            sessionId: sessionId,
            data: data
        });
        props.clearText();
    }}>Send</button>
);

const mapStateToProps = state => {
    return {
        receiver: state.receiver,
        user: state.user,
        limit: state.limit,
    }
};

export default connect(mapStateToProps)(sendMessageButton)