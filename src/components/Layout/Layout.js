import React from 'react';

import { Screens } from './../../App';
import ChatListLayout from "./ChatListLayout/ChatListLayout";
import SignupLayout from "./SignupLayout/SignupLayout";
import LoginLayout from "./LoginLayout/LoginLayout";
import ChatLayout from "./ChatLayout/ChatLayout";
import WithBackbutton from "../../hoc/WithBackbutton";

const layout = (props) => {
    let { screen } = props;
    let specificScreen = null;
    switch (screen) {
        case (Screens.CHATLIST):
            specificScreen = (
                <ChatListLayout {...props} />
            );
            break;
        case (Screens.SIGNUP):
            specificScreen = <SignupLayout {...props} />;
            break;
        case (Screens.LOGIN):
            specificScreen = <LoginLayout {...props} />;
            break;
        case (Screens.CHAT):
            specificScreen = (
                <WithBackbutton backbuttonClicked={() => props.changeScreen(Screens.CHATLIST)}>
                    <ChatLayout {...props} />
                </WithBackbutton>
            );
            break;
        default:
            break;
    }
    return specificScreen;
};

export default layout;
