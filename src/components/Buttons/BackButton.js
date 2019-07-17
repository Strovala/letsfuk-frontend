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
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(backButton);
