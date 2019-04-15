import React from 'react';

import Aux from './../../hoc/Aux'
import axios from "axios";
import {cookies, Screens} from "../../App";

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
            let sessionId = cookies.get('session-id');
            if (!sessionId) {
                sessionId = this.props.user.sessionId;
            }
            axios.post('/auth/logout', {}, {headers: {"session-id": sessionId}})
                .then(response => {
                    cookies.remove('user-id');
                    cookies.remove('session-id');
                    props.changeUser(null);
                    props.changeScreen(Screens.LOGIN);
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        }}>Logout</button>
    </Aux>
);

export default bottomNavigation;
