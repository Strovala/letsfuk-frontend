import Aux from "../../../hoc/Aux";
import React, {Component} from "react";
import Login from "../../Login/Login";
import {Screens, cookies} from "../../../App";
import axios from "axios";

class LoginLayout extends Component {

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
                        console.log(error.response.data);
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
                    <Login {...this.props} />
                </div>
                <button onClick={() => {
                    this.props.changeScreen(Screens.SIGNUP);
                }}>Sign Up
                </button>
            </Aux>
        );
    }
}

export default LoginLayout;
