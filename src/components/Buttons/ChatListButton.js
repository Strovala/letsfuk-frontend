import React from 'react';
import Aux from "../../hoc/Aux";
import {ActionTypes, Constants, Screens} from "../../globals/constants";
import {connect} from "react-redux";

const chatListButton = props => (
    <Aux>
        <button onClick={() => {
            props.changeScreen(Screens.CHAT_LIST);
            props.changeLimit(Constants.LIMIT);
        }}>Chat List</button>
    </Aux>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeLimit: (limit) => dispatch({type: ActionTypes.LIMIT_CHANGE, limit: limit}),
    }
};

export default connect(null, mapDispatchToProps)(chatListButton);