import React from "react";
import {connect} from "react-redux";
import {API} from "../../globals/methods";


const sendMessageButton = (props) => (
    <button onClick={() => {
        let data = {
            "text": props.text
        };
        if (!props.receiver.isStation) {
            data['user_id'] = props.receiver.userId;
        }
        API.sendMessage({
            user: props.user,
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