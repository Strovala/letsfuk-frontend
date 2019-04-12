import React from 'react';

import { Screens } from './../../App';
import ChatListLayout from "./ChatListLayout/ChatListLayout";
import SignupLayout from "./SignupLayout/SignupLayout";
import LoginLayout from "./LoginLayout/LoginLayout";
import ChatLayout from "./ChatLayout/ChatLayout";

const layout = (props) => {
    let { screen } = props;
    let specificScreen = null;
    console.log(screen);
    if (screen === Screens.CHATLIST) {
        specificScreen = <ChatListLayout {...props} />
    } else if (screen === Screens.SIGNUP) {
        specificScreen = <SignupLayout {...props} />
    } else if (screen === Screens.LOGIN) {
        specificScreen = <LoginLayout {...props} />
    } else if (screen === Screens.CHAT) {
        specificScreen = <ChatLayout {...props} />
    }
    return specificScreen;
};

export default layout;
