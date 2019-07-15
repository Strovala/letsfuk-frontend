import SignUp from "../../SignUp/SignUp";
import Aux from "../../../hoc/Aux";
import React, {Component} from "react";
import {API} from "../../../globals/methods";
import {ActionTypes, Screens} from "../../../globals/constants";
import LoginLayoutButton from "../../Buttons/LoginLayoutButton";
import {connect} from "react-redux";

class SignupLayout extends Component {

    componentDidMount() {
        // In case user somehow land on SignUp page while he is logged in
        API.whoAmI({
            response: response => {
                this.props.changeUser(response.data);
                this.props.changeScreen(Screens.CHAT_LIST);
            },
        });

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
