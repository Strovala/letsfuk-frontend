import React from 'react';

import Aux from './../../hoc/Aux'
import axios from "axios";
import {Screens} from "../../App";

const bottomNavigation = (props) => (
    <Aux>
        <button onClick={(event) => {
            props.changeScreen(Screens.CHATLIST);
        }}>Chat list</button>
        <button onClick={(event) => {
            // props.changeScreen(Screens.CHAT);
        }}>Group Chat</button>
        <button>Settings</button>
        <button onClick={(event) => {
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
