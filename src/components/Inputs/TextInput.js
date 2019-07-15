import React from "react";

const textInput = (props) => (
    <input type="text" value={props.value} onChange={props.changed} />
);

export default textInput;
