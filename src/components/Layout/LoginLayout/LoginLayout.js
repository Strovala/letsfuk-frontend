import Aux from "../../../hoc/Aux";
import React from "react";
import Login from "../../Login/Login";
import {Screens} from "../../../App";

const loginLayout = (props) => (
    <Aux>
        <div><button>Backbutton</button></div>
        <div>
            <Login {...props} />
        </div>
        <button onClick={() => {
            props.changeScreen(Screens.SIGNUP);
        }}>Sign Up</button>
    </Aux>
);

export default loginLayout;
