import React from 'react';
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";
import {API} from "../../globals/methods";

const registerButton = (props) => (
    <button onClick={() => {
        let data = {
            username: props.username,
            email: props.email,
            password: props.password
        };
        API.register({
            data: data,
            response: () => {
                props.clearPassword();
                props.clearUsername();
                props.clearEmail();
                props.changeScreen(Screens.LOGIN);
            }
        });
    }}>SignUp</button>
);

const mapStateToProps = state => {
    return {
        username: state.username,
        email: state.email,
        password: state.password,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        clearPassword: () => dispatch({type: ActionTypes.PASSWORD_CHANGE, password: ""}),
        clearEmail: () => dispatch({type: ActionTypes.EMAIL_CHANGE, email: ""}),
        clearUsername: () => dispatch({type: ActionTypes.USERNAME_CHANGE, username: ""}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(registerButton);