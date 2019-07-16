import React from "react";
import Chat from "../../Chat/Chat";
import WithUpperNavigation from "../../../hoc/WithUpperNavigation";
import {Screens} from "../../../globals/constants";
import WithBottomNavigation from "../../../hoc/WithBottomNavigation";

const chatLayout = () => (
    <WithUpperNavigation screen={Screens.CHAT_LIST}>
        <WithBottomNavigation>
            <Chat />
        </WithBottomNavigation>
    </WithUpperNavigation>
);

export default chatLayout