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
                props.changeScreen(Screens.LOGIN);
            },
            error: error => {
                if (error.response)
                    props.onError(error.response.data)
            }
        });
    }}>SignUp</button>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
    }
};

export default connect(null, mapDispatchToProps)(registerButton);