import SignUp from "../../SignUp/SignUp";
import Aux from "../../../hoc/Aux";
import React, {Component} from "react";
import {cookies, Screens} from "../../../App";
import axios from "axios";

class SignupLayout extends Component {

    componentDidMount() {
        let sessionId = cookies.get('session-id');
        if (sessionId) {
            let userId = cookies.get('user-id');
            if (userId) {
                axios.get(`/users/${userId}`, { headers: { "session-id": sessionId } })
                    .then(response => {
                        this.props.changeUser(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                this.props.changeScreen(Screens.CHATLIST);
            }
        }
    }

    render() {
        return (
            <Aux>
                <div>
                    <button>Backbutton</button>
                </div>
                <div>
                    <SignUp {...this.props} />
                </div>
                <button onClick={() => {
                    this.props.changeScreen(Screens.LOGIN);
                }}>Login
                </button>
            </Aux>
        );
    }
}

export default SignupLayout;
