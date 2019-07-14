import SignUp from "../../SignUp/SignUp";
import Aux from "../../../hoc/Aux";
import React, {Component} from "react";
import {checkUserFromCookie, API} from "../../../globals/methods";
import {ActionTypes, Screens} from "../../../globals/constants";
import LoginLayoutButton from "../../Buttons/LoginLayoutButton";
import connect from "react-redux/es/connect/connect";

class SignupLayout extends Component {

    componentDidMount() {
        // In case user somehow land on SignUp page while he is logged in
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
        this.props.changeScreen(Screens.CHAT_LIST);

    }

    render() {
        return (
            <Aux>
                <SignUp />
                <LoginLayoutButton />
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

export default connect(null, mapDispatchToProps)(SignupLayout);
