import React from 'react';
import Aux from "../../hoc/Aux";
import {ActionTypes, Screens} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";

const signUpLayoutButton = props => (
    <Aux>
        <button onClick={() => props.changeScreen(Screens.SIGNUP)}>Sign Up</button>
    </Aux>
);


const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
    }
};

export default connect(null, mapDispatchToProps)(signUpLayoutButton);
