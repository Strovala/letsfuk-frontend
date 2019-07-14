import React from 'react';
import {ActionTypes, cookies, Screens} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";
import {API} from "../../globals/methods";
import {initWebSocket} from "../../fancyWebSocket";

const loginButton = props => (
    <button onClick={() => {
        let data = {
            username: this.props.credentials,
            email: this.props.credentials,
            password: this.props.password,
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
                    cookies.set('user-id', userId.userId);
                    this.props.changeUser(response.data);
                    const webSocket = initWebSocket(userId);
                    this.props.changeWebSocket(webSocket);
                    this.props.changeScreen(Screens.CHAT_LIST);
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(loginButton);