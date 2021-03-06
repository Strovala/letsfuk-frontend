import React from 'react';
import {
    API,
    clearCaches,
    getPushNotificationUserSub
} from "../../globals/methods";
import {Screens, cookies, ActionTypes} from "../../globals/constants";
import {connect} from "react-redux";
import {Btn} from './LogoutButton.module.scss';

const logoutButton = props => (
    <button className={Btn} onClick={() => {
        const logout = () => {
            API.logout({
                user: props.user,
                response: () => {
                    cookies.remove('user-id');
                    cookies.remove('session-id');
                    clearCaches();
                    props.changeAuthenticated(false);
                    props.changeScreen(Screens.LOGIN);
                    // changing user needs to go after changing screen
                    // because Chat screen uses user
                    props.changeUser(null);
                    props.changeWebSocket(null);
                }
            })
        };
        getPushNotificationUserSub(props.user)
            .then(sub => {
                if (sub !== null) {
                    API.unsubscribePushNotification({
                        user: props.user,
                        data: sub.toJSON(),
                        response: logout,
                        error: logout
                    })
                } else {
                    logout()
                }
            });
    }}>Logout</button>
);

const mapStateToProps = state => {
    return {
        user: state.user,
        job: state.periodicJob
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeWebSocket: (value) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, value: value}),
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(logoutButton);