import React from 'react';

import Aux from '../../../hoc/Aux';
import classes from './Chat.css';

const chat = (props) => (
    <Aux>
        <p>{props.username}</p>
        <span
            className={classes.avatar}
            style={{backgroundColor: '#777'}}
        />
        <p>{props.lastMessage.username}: {props.lastMessage.message}</p>
    </Aux>
);

export default chat;
