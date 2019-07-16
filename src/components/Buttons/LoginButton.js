import React from 'react';
import {ActionTypes, cookies, Screens} from "../../globals/constants";
import {connect} from "react-redux";
import {API} from "../../globals/methods";
import {initWebSocket} from "../../fancyWebSocket";
import Button from "@material-ui/core/Button/Button";

const loginButton = props => (
    <Button
        type={props.type}
        fullWidth={props.fullWidth}
        variant={props.variant}
        color={props.color}
        className={props.className}
        onClick={() => {
            let data = {
                username: props.data.credentials,
                email: props.data.credentials,
                password: props.data.password,
                lat: "",
                lon: ""
            };
            navigator.geolocation.getCurrentPosition((location) => {
                data.lat = location.coords.latitude;
                data.lon = location.coords.longitude;
                API.login({
                    data: data,
                    response: response => {
                        const userId = response.data.user.userId;
                        cookies.set('session-id', response.data.sessionId);
                        cookies.set('user-id', userId);
                        props.changeAuthenticated(true);
                        props.changeUser(response.data);
                        const webSocket = initWebSocket(userId);
                        props.changeWebSocket(webSocket);
                        props.changeScreen(Screens.CHAT_LIST);
                    },
                    error: error => {
                        if (error.response)
                            props.onError(error.response.data);
                    }
                });
            }, (err) => {
                console.log(err);
            }, {
                maximumAge: 60000,
                timeout: 5000,
                enableHighAccuracy: true
        });
    }}>Log In</Button>
);

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeWebSocket: (value) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(loginButton);