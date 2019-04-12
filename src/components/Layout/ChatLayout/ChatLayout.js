import Aux from "../../../hoc/Aux";
import React from "react";
import Chat from "../../Chat/Chat";
import BottomNavigation from "../../BottomNavigation/BottomNavigation";

const chatLayout = (props) => (
    <Aux>
        <div><button>Backbutton</button></div>
        <div>
            <Chat {...props} />
        </div>
        <BottomNavigation {...props} />
    </Aux>
);

export default chatLayout;
