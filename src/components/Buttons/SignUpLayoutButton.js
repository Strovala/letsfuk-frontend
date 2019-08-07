import React from 'react';
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";
import Link from "@material-ui/core/Link/Link";

const signUpLayoutButton = props => (
    <Link
        variant={props.variant}
        component={props.component}
        className={props.className}
        onClick={() => props.changeScreen(Screens.REGISTER)}>
        {"Don't have an account? Sign Up"}
    </Link>
);


const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(signUpLayoutButton);
