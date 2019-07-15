import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import RegisterButton from "../Buttons/RegisterButton";
import LabelInput from "../Inputs/LabelInputs/LabelInput";
import TextError from "../Errors/TextError";

class SignUp extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        error: null,
    };

    handleUsername(event) {
        this.setState({
            username: event.target.value
        })
    }

    handleEmail(event) {
        this.setState({
            email: event.target.value
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

    render() {
        return (
            <Aux>
                <LabelInput
                    type={"text"}
                    label={"Username"}
                    value={this.state.username}
                    changed={(event) => this.handleUsername(event)}
                />
                <LabelInput
                    type={"text"}
                    label={"Email"}
                    value={this.state.email}
                    changed={(event) => this.handleEmail(event)}
                />
                <LabelInput
                    type={"password"}
                    label={"Password"}
                    value={this.state.password}
                    changed={(event) => this.handlePassword(event)}
                />
                <TextError error={this.state.error}/>
                <RegisterButton {...this.state} onError={(error) => this.handleError(error)}/>
            </Aux>
        );
    }
}

export default SignUp;
