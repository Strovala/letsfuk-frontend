import React from 'react';
import {API} from "../../globals/methods";
import {Screens, cookies, ActionTypes} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";

const logoutButton = props => (
    <button onClick={() => {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        API.logout({
            sessionId: sessionId,
            response: () => {
                cookies.remove('user-id');
                cookies.remove('session-id');
                props.changeUser(null);
                props.changeWebSocket(null);
                props.changeScreen(Screens.LOGIN);
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
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(logoutButton);