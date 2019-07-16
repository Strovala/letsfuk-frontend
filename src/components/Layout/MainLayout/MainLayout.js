import React from 'react';
import {connect} from "react-redux";
import {Screens} from "../../../globals/constants";
import ChatListLayout from "./ChatListLayout/ChatListLayout";
import ChatLayout from "./ChatLayout/ChatLayout";

const mainLayout = (props) => {
    switch (props.screen) {
        case (Screens.CHAT_LIST):
            return <ChatListLayout />;
        case (Screens.CHAT):
            return <ChatLayout />;
        default:
            return <ChatListLayout />
    }
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(mainLayout);
