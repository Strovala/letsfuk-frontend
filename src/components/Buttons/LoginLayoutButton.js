import React from 'react';
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";
import Link from "@material-ui/core/Link/Link";

const loginLayoutButton = props => (
    <Link
        variant={props.variant}
        component={props.component}
        className={props.className}
        onClick={() => props.changeScreen(Screens.LOGIN)}>
        {"Already have an account? Log in"}
    </Link>
);


const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(loginLayoutButton);