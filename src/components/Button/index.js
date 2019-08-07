import React from "react";
import './Button.scss';

export default (props) => (
    <button className={`btn ${props.className}`} onClick={props.onClick}>{props.children}</button>
)