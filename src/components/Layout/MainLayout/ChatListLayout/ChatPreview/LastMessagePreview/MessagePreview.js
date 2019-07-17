import React from "react";
import {styles} from "../LastMessagePreview";
import {withStyles} from "@material-ui/core";
import {trimLastMessageText} from "../../../../../../globals/methods";
import PrivateMessagePreview from "./PrivateMessagePreview";
import StationMessagePreview from "./StationMessagePreview";

const messagePreview = (props) => {
    let message = trimLastMessageText(props.message, 20);
    let newProps = {...props};
    newProps.message = message;
    let preview = <PrivateMessagePreview {...newProps}/>;
    if (props.isStation) {
        preview = <StationMessagePreview {...newProps}/>
    }
    return preview;
};

export default withStyles(styles)(messagePreview);