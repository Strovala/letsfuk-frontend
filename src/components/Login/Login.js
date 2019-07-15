import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import LoginButton from "../Buttons/LoginButton";
import LabelInput from "../Inputs/LabelInputs/LabelInput";
import TextError from "../Errors/TextError";


class Login extends Component {
    state = {
        credentials: "",
        password: "",
        error: null,
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

    handleError(error) {
        this.setState({
            error: error
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
                <TextError error={this.state.error}/>
                <LoginButton {...this.state} onError={(error) => this.handleError(error)}/>
            </Aux>
        );
    }
}

export default Login;
