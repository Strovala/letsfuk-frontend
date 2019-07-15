import React from 'react';
import SignupLayout from "./SignupLayout/SignupLayout";
import LoginLayout from "./LoginLayout/LoginLayout";
import {connect} from "react-redux";
import {Screens} from "../../globals/constants";
import ChatLayout from "./ChatLayout/ChatLayout";
import ChatListLayout from "./ChatListLayout/ChatListLayout";

const layout = (props) => {
    let { screen } = props;
    let specificScreen = null;
    switch (screen) {
        case (Screens.LOGIN):
            specificScreen = <LoginLayout />;
            break;
        case (Screens.SIGNUP):
            specificScreen = <SignupLayout />;
            break;
        case (Screens.CHAT_LIST):
            specificScreen = <ChatListLayout />;
            break;
        case (Screens.CHAT):
            specificScreen = <ChatLayout />;
            break;
        default:
            specificScreen = <LoginLayout />;
            break;
    }
    return specificScreen;
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(layout);
