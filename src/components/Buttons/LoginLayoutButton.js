import React from 'react';
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";

const loginLayoutButton = props => (
    <div>
        <button onClick={() => props.changeScreen(Screens.LOGIN)}>Login</button>
    </div>
);


const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
    }
};

export default connect(null, mapDispatchToProps)(loginLayoutButton);