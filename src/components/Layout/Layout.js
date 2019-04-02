import React from 'react';

import Aux from '../../hoc/Aux';
import BottomNavigation from './../../components/BottomNavigation/BottomNavigation';
import classes from './Layout.css';

const layout = (props) => (
    <Aux>
        <div><button>Backbutton</button></div>
        <main className={classes.Content}>
            {props.children}
        </main>
        <BottomNavigation />
    </Aux>
);

export default layout;
