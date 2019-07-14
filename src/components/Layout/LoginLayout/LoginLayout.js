import Aux from "../../../hoc/Aux";
import React, {Component} from "react";
import Login from "../../Login/Login";
import {initWebSocket} from "../../../fancyWebSocket";
import {checkUserFromCookie, API} from "../../../globals/methods";
import {ActionTypes, Screens} from "../../../globals/constants";
import SignUpLayoutButton from "../../Buttons/SignUpLayoutButton";
import connect from "react-redux/es/connect/connect";

class LoginLayout extends Component {

    componentDidMount() {
        const {sessionId, userId} = checkUserFromCookie();
        if (!userId)
            return;
        API.getUser({
            sessionId: sessionId,
            userId: userId,
            response: response => {
                const userData = response.data;
                this.props.changeUser({
                    user: userData,
                    sessionId: sessionId
                });
            },
        });
        const webSocket = initWebSocket(userId);
        this.props.changeWebSocket(webSocket);
        this.props.changeScreen(Screens.CHAT_LIST);
    }

    render() {
        return (
            <Aux>
                <Login />
                <SignUpLayoutButton />
            </Aux>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen}),
        changeWebSocket: (webSocket) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, webSocket: webSocket}),
        changeUser: (user) => dispatch({type: ActionTypes.USER_CHANGE, user: user}),
    }
};

export default connect(null, mapDispatchToProps)(LoginLayout);
