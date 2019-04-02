import React from 'react';

import Aux from '../../hoc/Aux';
import LabelBottomNavigation from './../../containers/LabelBottomNavigation/LabelBottomNavigation';
import classes from './Layout.css';

const layout = (props) => (
    <Aux>
        <div>Backbutton, search area</div>
        <main className={classes.Content}>
            {props.children}
        </main>
        <LabelBottomNavigation />
    </Aux>
);

export default layout;
