import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import LoginButton from "../Buttons/LoginButton";
import LabelInput from "../Inputs/LabelInputs/LabelInput";


class Login extends Component {
    state = {
        credentials: "",
        password: "",
    };

    handleCredentials(event) {
        this.setState({
            credentials: event.target.value
        })
    }

    handlePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    render () {
        return (
            <Aux>
                <LabelInput
                    type={"text"}
                    label={"Username/email"}
                    value={this.state.credentials}
                    changed={(event) => this.handleCredentials(event)}
                />
                <LabelInput
                    type={"password"}
                    label={"Password"}
                    value={this.state.password}
                    changed={(event) => this.handlePassword(event)}
                />
                <LoginButton {...this.state} />
            </Aux>
        );
    }
}

export default Login;
