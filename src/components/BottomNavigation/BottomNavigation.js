import React from 'react';

import Aux from './../../hoc/Aux'
import ChatListButton from "../Buttons/ChatListButton";
import StationChatButton from "../Buttons/StationChatButton";
import LogoutButton from "../Buttons/LogoutButton";

const bottomNavigation = (props) => (
    <Aux>
        <ChatListButton />
        <StationChatButton />
        <LogoutButton />
    </Aux>
);

export default bottomNavigation;
