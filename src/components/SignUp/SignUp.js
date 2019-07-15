import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import RegisterButton from "../Buttons/RegisterButton";
import LabelInput from "../Inputs/LabelInputs/LabelInput";

class SignUp extends Component {
    state = {
        username: "",
        email: "",
        password: "",
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
                <RegisterButton {...this.state} />
            </Aux>
        );
    }
}

export default SignUp;
