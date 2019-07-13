import React from 'react';
import Aux from "../../hoc/Aux";

const backbutton = props => (
    <Aux>
        <button onClick={props.clicked}>Backbutton</button>
    </Aux>
);

export default backbutton;