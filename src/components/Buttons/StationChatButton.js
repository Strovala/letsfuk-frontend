import React from 'react';
import Aux from "../../hoc/Aux";
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";

const stationChatButton = props => (
    <Aux>
        <button onClick={() => {
            props.changeReceiver(props.activeStation);
            props.changeScreen(Screens.CHAT)
        }}>Station Chat</button>
    </Aux>
);

const mapStateToProps = state => {
    return {
        activeStation: state.activeStation
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeActiveChat: (chat) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, chat: chat}),
        changeReceiver: (receiver) => dispatch({type: ActionTypes.RECEIVER_CHANGE, receiver: receiver}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(stationChatButton);