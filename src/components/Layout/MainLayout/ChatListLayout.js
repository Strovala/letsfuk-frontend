import React from "react";
import ChatList from "../../ChatList/ChatList";
import WithBottomNavigation from "../../../hoc/WithBottomNavigation";

const chatListLayout = () => (
    <WithBottomNavigation>
        <ChatList />
    </WithBottomNavigation>
);

export default chatListLayout;
