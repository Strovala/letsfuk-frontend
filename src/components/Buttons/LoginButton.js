import React from 'react';
import {ActionTypes, cookies, Screens} from "../../globals/constants";
import {connect} from "react-redux";
import {API} from "../../globals/methods";
import {initWebSocket} from "../../fancyWebSocket";

const loginButton = props => (
    <button onClick={() => {
        let data = {
            username: props.credentials,
            email: props.credentials,
            password: props.password,
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
                    props.changeUser(response.data);
                    const webSocket = initWebSocket(userId);
                    props.changeWebSocket(webSocket);
                    props.changeScreen(Screens.CHAT_LIST);
                    props.clearCredentials();
                    props.clearPassword();
                }
            });
        }, (err) => {
            console.log(err);
        }, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    }}>Login</button>
);

const mapStateToProps = state => {
    return {
        credentials: state.credentials,
        password: state.password,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeUser: (user) => dispatch({type: ActionTypes.USER_CHANGE, screen: user}),
        changeWebSocket: (webSocket) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, webSocket: webSocket}),
        clearPassword: () => dispatch({type: ActionTypes.PASSWORD_CHANGE, password: ""}),
        clearCredentials: () => dispatch({type: ActionTypes.CREDENTIALS_CHANGE, credentials: ""}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(loginButton);