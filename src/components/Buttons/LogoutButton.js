import React from 'react';
import {API} from "../../globals/methods";
import {Screens, cookies, ActionTypes} from "../../globals/constants";
import {connect} from "react-redux";

const logoutButton = props => (
    <button onClick={() => {
        API.logout({
            user: props.user,
            response: () => {
                cookies.remove('user-id');
                cookies.remove('session-id');
                props.changeScreen(Screens.LOGIN);
                // changing user needs to go after changing screen
                // because Chat screen uses user
                props.changeUser(null);
                props.changeWebSocket(null);
            }
        })
    }}>Logout</button>
);

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeWebSocket: (webSocket) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, webSocket: webSocket}),
        changeUser: (user) => dispatch({type: ActionTypes.USER_CHANGE, user: user}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(logoutButton);