import React from "react";
import Aux from "../../../components/hoc/Aux";
import '../Login.scss';

export default (props) => (
    <Aux>
        <span className="form__input-icon"><i className={props.iconClassName}/></span>
        <input className="form__input" {...props.inputProps}/>
    </Aux>
);