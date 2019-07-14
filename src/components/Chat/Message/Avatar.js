import React from "react";
import {ActionTypes, Screens} from "../../../globals/constants";
import connect from "react-redux/es/connect/connect";

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
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeReceiver: (receiver) => dispatch({type: ActionTypes.RECEIVER_CHANGE, receiver: receiver}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(avatar);
