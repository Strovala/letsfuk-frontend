import React from 'react';
import Aux from "./Aux";
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';

const withBottomNavigation = props => (
    <Aux>
        {props.children}
        <BottomNavigation />
    </Aux>
);

export default withBottomNavigation;