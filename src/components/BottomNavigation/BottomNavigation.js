import React from 'react';

import Aux from './../../hoc/Aux'
import { Screens } from "../../App";
import axios from "axios";

const bottomNavigation = (props) => (
    <Aux>
        <button>Chat list</button>
        <button>Group Chat</button>
        <button>Settings</button>
        {console.log('propss' + props.user)}
        <button onClick={(event) => {
            console.log("props " + props.user);
            axios.post('/auth/logout', {}, {headers: {"session-id": props.user.sessionId}})
                .then(response => {
                    console.log(response.data);
                    props.changeUser(null);
                    props.changeScreen(Screens.LOGIN);
                })
                .catch(error => {
                    console.log(error);
                })
        }}>Logout</button>
    </Aux>
);

export default bottomNavigation;
