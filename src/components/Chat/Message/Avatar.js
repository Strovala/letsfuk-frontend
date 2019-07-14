import React from "react";
import {ActionTypes, Screens} from "../../../globals/constants";
import connect from "react-redux/es/connect/connect";

const avatar = (props) => (
    <output onClick={() => {
        props.changeReceiver(props.sender);
        props.changeScreen(Screens.CHAT);
    }}>{props.sender.username}</output>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeReceiver: (receiver) => dispatch({type: ActionTypes.RECEIVER_CHANGE, receiver: receiver}),
    }
};

export default connect(null, mapDispatchToProps)(avatar);
