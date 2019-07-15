import Aux from "../../../hoc/Aux";
import React, {Component} from "react";
import Login from "../../Login/Login";
import {initWebSocket} from "../../../fancyWebSocket";
import {API} from "../../../globals/methods";
import {ActionTypes, Screens} from "../../../globals/constants";
import SignUpLayoutButton from "../../Buttons/SignUpLayoutButton";
import {connect} from "react-redux";

class LoginLayout extends Component {

    componentDidMount() {
        API.whoAmI({
            response: response => {
                this.props.changeUser(response.data);
                const webSocket = initWebSocket(response.data.user.userId);
                this.props.changeWebSocket(webSocket);
                this.props.changeScreen(Screens.CHAT_LIST);
            },
        });
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
