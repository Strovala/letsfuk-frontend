import React from 'react';

import Aux from '../../hoc/Aux';


const layout = (props) => (
    <Aux>
        <div>Backbutton, search area</div>
        <main>
            {props.children}
        </main>
        <div>Bottom navigation</div>
    </Aux>
);

export default layout;
