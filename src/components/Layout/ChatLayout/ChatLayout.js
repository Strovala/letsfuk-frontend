import Aux from "../../../hoc/Aux";
import React from "react";
import Chat from "../../Chat/Chat";
import BottomNavigation from "../../BottomNavigation/BottomNavigation";

const chatLayout = (props) => {
    let receiver = props.receiver;
    if (receiver)
        receiver = receiver.userId;
    let key = `${props.isStation};${receiver}`;
    return (
        <Aux>
            <div><button>Backbutton</button></div>
            <div>
                <Chat key={key} {...props} />
            </div>
            <BottomNavigation {...props} />
        </Aux>
    );
};

export default chatLayout;
