import React from "react";
import Aux from "../../../components/hoc/Aux";
import '../Login.scss';

export default (props) => (
    <Aux>
        <span className={props.spanClassName}><i className={props.iconClassName}/></span>
        <input className={props.className} {...props.inputProps}/>
    </Aux>
);