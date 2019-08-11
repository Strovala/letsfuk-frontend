import React from "react";
import './Toogle.scss';

export default (props) => (
    <div className="toogle-container">
        <label className="toogle-wrap">
            <input type="checkbox" onChange={props.onChange} checked={props.checked} />
            <div className="toogle"/>
        </label>
    </div>
)