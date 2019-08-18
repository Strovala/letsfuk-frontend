import React from 'react';
import {connect} from "react-redux";
import {Screens} from "../../../globals/constants";
import MessagesScreen from "../../../screens/Messages";
import ChatScreen from "../../../screens/Chat";
import SettingsScreen from "../../../screens/Settings";
import NewMessageScreen from "../../../screens/NewMessage";
import MembersPreviewScreen from "../../../screens/MembersPreview";

const mainLayout = (props) => {
    switch (props.screen) {
        case (Screens.MESSAGES):
            return <MessagesScreen />;
        case (Screens.CHAT):
            return <ChatScreen />;
         case (Screens.SETTINGS):
            return <SettingsScreen />;
        case (Screens.NEW_MESSAGE):
            return <NewMessageScreen />;
        case (Screens.MEMBERS_PREVIEW):
            return <MembersPreviewScreen />;
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
