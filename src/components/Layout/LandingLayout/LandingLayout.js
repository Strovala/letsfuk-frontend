import React from 'react';
import {connect} from "react-redux";
import {Screens} from "../../../globals/constants";
import LogInLayout from "./LogInLayout";
import SignUpLayout from "./SignUpLayout";

const landingLayout = (props) => {
    switch (props.screen) {
        case (Screens.LOGIN):
            return <LogInLayout />;
        case (Screens.SIGNUP):
            return <SignUpLayout />;
        default:
            return <LogInLayout />
    }
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(landingLayout);
