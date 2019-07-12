import React from "react";
import Aux from '../../../hoc/Aux'

const avatar = (props) => (
    <Aux>
        <output onClick={(event) => props.avatarClicked(event)}>{props.value}</output>
    </Aux>
);

export default avatar;
