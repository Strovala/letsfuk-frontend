import React from 'react';
import Aux from "./Aux";
import Backbutton from "../components/Buttons/BackButton";

const withUpperNavigation = props => (
    <Aux>
        <Backbutton screen={props.screen}/>
        {props.children}
    </Aux>
);

export default withUpperNavigation;