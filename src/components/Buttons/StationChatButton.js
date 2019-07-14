import React from 'react';
import Aux from "../../hoc/Aux";
import {ActionTypes, Screens} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";

const stationChatButton = props => (
    <Aux>
        <button onClick={() => props.changeScreen(Screens.CHAT)}>Station Chat</button>
    </Aux>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen})
    }
};

export default connect(null, mapDispatchToProps)(stationChatButton);