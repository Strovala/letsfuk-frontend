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
    console.log(screen);
    if (screen === Screens.CHATLIST) {
        specificScreen = <ChatListLayout {...newProps} />
    } else if (screen === Screens.SIGNUP) {
        specificScreen = <SignupLayout {...newProps} />
    } else if (screen === Screens.LOGIN) {
        specificScreen = <LoginLayout {...newProps} />
    } else if (screen === Screens.CHAT) {
        specificScreen = <ChatLayout {...newProps} />
    }
    return specificScreen;
};

export default layout;
