import React from "react";
import IconButton from "@material-ui/core/IconButton/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";


const backButton = (props) => (
    <IconButton className={props.className} onClick={props.clicked}>
        <KeyboardArrowLeftIcon />
    </IconButton>
);

export default backButton;