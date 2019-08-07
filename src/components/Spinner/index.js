import React from "react";
import './Spinner.scss';

export default (props) => (
    <div className={`spinner ${props.className}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);
