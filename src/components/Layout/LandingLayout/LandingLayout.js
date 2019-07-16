import React from 'react';
import SignupLayout from "./LandingLayout/SignUpLayout";
import LoginLayout from "./LandingLayout/LoginLayout";
import {connect} from "react-redux";
import {Screens} from "../../globals/constants";
import ChatLayout from "./MainLayout/ChatLayout";
import ChatListLayout from "./MainLayout/ChatListLayout";

const landingLayout = (props) => {
    let { screen } = props;
    let specificScreen = <LoginLayout />;
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
            break;
    }
    return specificScreen;
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(landingLayout);
