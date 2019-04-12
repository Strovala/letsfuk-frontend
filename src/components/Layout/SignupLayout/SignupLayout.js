import SignUp from "../../SignUp/SignUp";
import Aux from "../../../hoc/Aux";
import React from "react";
import {Screens} from "../../../App";

const signupLayout = (props) => (
    <Aux>
        <div><button>Backbutton</button></div>
        <div>
            <SignUp {...props} />
        </div>
        <button onClick={() => {
            props.changeScreen(Screens.LOGIN);
        }}>Login</button>
    </Aux>
);

export default signupLayout;
