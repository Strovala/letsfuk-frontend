import React from 'react';
import {connect} from "react-redux";
import {Screens} from "../../../globals/constants";
import ChatLayout from "./ChatLayout/ChatLayout";
import MessagesScreen from "../../../screens/Messages";
import SettingsScreen from "../../../screens/Settings";

const mainLayout = (props) => {
    switch (props.screen) {
        case (Screens.MESSAGES):
            return <MessagesScreen />;
        case (Screens.CHAT):
            return <ChatLayout />;
         case (Screens.SETTINGS):
            return <SettingsScreen />;
        default:
            return <MessagesScreen />
    }
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(mainLayout);
