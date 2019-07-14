import React from 'react';
import {ActionTypes, Screens} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";
import {API} from "../../globals/methods";

const registerButton = () => (
    <button onClick={() => {
        let data = {
            username: this.props.username,
            email: this.props.email,
            password: this.props.password
        };
        API.register({
            data: data,
            response: () => {
                this.props.changeScreen(Screens.LOGIN)
            }
        });
    }}>Login</button>
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
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(registerButton);