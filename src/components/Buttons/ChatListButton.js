import React from 'react';
import Aux from "../../hoc/Aux";
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";

const chatListButton = props => (
    <Aux>
        <button onClick={() => props.changeScreen(Screens.CHAT_LIST)}>Chat List</button>
    </Aux>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen})
    }
};

export default connect(null, mapDispatchToProps)(chatListButton);