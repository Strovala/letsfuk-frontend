import React from "react";
import {ActionTypes, Screens} from "../../../globals/constants";
import {connect} from "react-redux";

const avatar = (props) => (
    <output onClick={() => {
        if (props.user.user.userId === props.sender.userId)
            return;
        const receiver = props.sender;
        receiver.id = receiver.userId;
        props.changeReceiver(receiver);
        props.changeScreen(Screens.CHAT);
    }}>{props.sender.username}</output>
);

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(avatar);
