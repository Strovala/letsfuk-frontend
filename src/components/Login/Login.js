import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import axios from 'axios';
import {Screens, cookies} from "../../App";

class Login extends Component {
    state = {
        credentials: "",
        password: "",
    };

    login() {
        let data = {
            username: this.state.credentials,
            email: this.state.credentials,
            password: this.state.password
        };
        axios.post('/auth/login', data)
            .then(response => {
                cookies.set('session-id', response.data.sessionId);
                cookies.set('user-id', response.data.user.userId);
                this.props.changeUser(response.data);
                this.props.changeScreen(Screens.CHATLIST);
            })
            .catch(error => {
                console.log(error);
            })
    }

    changeCredentials(event) {
        this.setState({
            credentials: event.target.value
        });
    }

    changePassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    render() {
        return (
            <Aux>
                <div>
                    <label>
                        Username/email:
                        <input type="text" value={this.state.credentials} onChange={(event) => this.changeCredentials(event)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={this.state.password} onChange={(event) => this.changePassword(event)} />
                    </label>
                </div>
                <div>
                    <button onClick={(event) => this.login(event)}>Login</button>
                </div>
            </Aux>
        );
    }
}

export default Login;
