import React from 'react';
import Aux from "./Aux";
import Backbutton from "../components/Layout/Backbutton";

const withBackbutton = props => (
    <Aux>
        <Backbutton clicked={props.backbuttonClicked}/>
        {props.children}
    </Aux>
);

export default withBackbutton;