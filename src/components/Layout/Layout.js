import React from 'react';

import { Screens } from './../../App';
import ChatListLayout from "./ChatListLayout/ChatListLayout";
import SignupLayout from "./SignupLayout/SignupLayout";
import LoginLayout from "./LoginLayout/LoginLayout";
import ChatLayout from "./ChatLayout/ChatLayout";

const layout = (props) => {
    let { screen, additionalProps } = props;
    let specificScreen = null;
    let newProps = {...props};
    if (additionalProps) {
        Object.assign(newProps, additionalProps);
    }
    switch (screen) {
        case (Screens.CHATLIST):
            specificScreen = <ChatListLayout {...newProps} />
            break;
        case (Screens.SIGNUP):
            specificScreen = <SignupLayout {...newProps} />
            break;
        case (Screens.LOGIN):
            specificScreen = <LoginLayout {...newProps} />
            break;
        case (Screens.CHAT):
            specificScreen = <ChatLayout {...newProps} />
            break;
        default:
            break;
    }
    return specificScreen;
};

export default layout;
