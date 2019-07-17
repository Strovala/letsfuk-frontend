import React from 'react';
import {ActionTypes, Screens} from "../../globals/constants";
import {connect} from "react-redux";
import {API} from "../../globals/methods";
import Button from "@material-ui/core/Button/Button";

const registerButton = (props) => (
    <Button
        type={props.type}
        fullWidth={props.fullWidth}
        variant={props.variant}
        color={props.color}
        className={props.className}
        onClick={() => {
            let data = {
                username: props.data.username,
                email: props.data.email,
                password: props.data.password
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
        }}>Sign Up</Button>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(registerButton);