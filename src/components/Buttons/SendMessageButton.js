import React from "react";
import {connect} from "react-redux";
import {API} from "../../globals/methods";
import IconButton from "@material-ui/core/IconButton/IconButton";
import SendIcon from "@material-ui/icons/Send";


const sendMessageButton = (props) => (
    <IconButton className={props.className} onClick={() => {
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
    }}>
        <SendIcon />
    </IconButton>
);

const mapStateToProps = state => {
    return {
        receiver: state.receiver,
        user: state.user,
        limit: state.limit,
    }
};

export default connect(mapStateToProps)(sendMessageButton)