import Aux from "../../../hoc/Aux";
import React from "react";
import BottomNavigation from "../../BottomNavigation/BottomNavigation";
import ChatList from "../../ChatList/ChatList";

const chatListLayout = (props) => (
    <Aux>
        <div><button>Backbutton</button></div>
        <div>
            <ChatList {...props} />
        </div>
        <BottomNavigation {...props} />
    </Aux>
);

export default chatListLayout;
