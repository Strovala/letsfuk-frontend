import React from 'react';
import Aux from "../../hoc/Aux";
import {ActionTypes} from "../../globals/constants";
import {connect} from "react-redux";

const backButton = props => (
    <Aux>
        <button onClick={() => {props.changeScreen(props.screen)}}>Backbutton</button>
    </Aux>
);
const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
    }
};

export default connect(null, mapDispatchToProps)(backButton);
