import React from 'react';
import Aux from '../../hoc/Aux';
import Username from "./Username";
import Password from "../Login/Password";
import RegisterButton from "../Buttons/RegisterButton";
import Email from "./Email";

const singUp = () => (
    <Aux>
        <Username />
        <Email />
        <Password />
        <RegisterButton />
    </Aux>
);

export default singUp;