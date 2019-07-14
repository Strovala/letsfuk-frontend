import React from 'react';
import Aux from '../../hoc/Aux';
import Credentials from "./Credentials";
import Password from "./Password";
import LoginButton from "../Buttons/LoginButton";

const login = () => (
    <Aux>
        <Credentials />
        <Password />
        <LoginButton />
    </Aux>
);

export default login;

