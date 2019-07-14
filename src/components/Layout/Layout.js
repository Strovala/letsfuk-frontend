import React from 'react';

import { Screens, ActionTypes } from './../../App';
import ChatListLayout from "./ChatListLayout/ChatListLayout";
import SignupLayout from "./SignupLayout/SignupLayout";
import LoginLayout from "./LoginLayout/LoginLayout";
import ChatLayout from "./ChatLayout/ChatLayout";
import WithBackbutton from "../../hoc/WithBackbutton";
import {connect} from "react-redux";

const layout = (props) => {
    let { screen } = props;
    let specificScreen = null;
    let newProps = {...props};
    newProps.changeScreen = props.onScreenChange;
    switch (screen) {
        case (Screens.CHATLIST):
            specificScreen = (
                <ChatListLayout {...newProps}/>
            );
            break;
        case (Screens.SIGNUP):
            specificScreen = <SignupLayout {...newProps} />;
            break;
        case (Screens.LOGIN):
            specificScreen = <LoginLayout {...newProps} />;
            break;
        case (Screens.CHAT):
            specificScreen = (
                <WithBackbutton backbuttonClicked={() => props.onScreenChange(Screens.CHATLIST)}>
                    <ChatLayout {...newProps} />
                </WithBackbutton>
            );
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

const mapDispatchToProps = dispatch => {
    return {
        onScreenChange: (screen) => dispatch({type: ActionTypes.SCREEN_CHANGE, screen: screen})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(layout);
