import React from 'react';
import {connect} from "react-redux";
import {Screens} from "../../../globals/constants";
import LoginScreen from "../../../screens/Login";
import RegisterScreen from "../../../screens/Register";

const landingLayout = (props) => {
    switch (props.screen) {
        case (Screens.LOGIN):
            return <LoginScreen  />;
        case (Screens.REGISTER):
            return <RegisterScreen />;
        default:
            return <LoginScreen  />
    }
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(landingLayout);
