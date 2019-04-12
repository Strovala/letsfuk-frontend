import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import { Screens } from './../../App';
import axios from 'axios';

class SignUp extends Component {
    state = {
        username: "",
        email: "",
        password: "",
    };

    register() {
        let data = {...this.state};
        axios.post('/users', data)
            .then(response => {
                console.log(response.data);
                this.props.changeScreen(Screens.LOGIN)
            })
            .catch(error => {
                console.log(error);
            })
    }

    changeUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    changeEmail(event) {
        this.setState({
            email: event.target.value
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
                        Username:
                        <input type="text" value={this.state.usernmae} onChange={(event) => this.changeUsername(event)} />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="text" value={this.state.email} onChange={(event) => this.changeEmail(event)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={this.state.password} onChange={(event) => this.changePassword(event)} />
                    </label>
                </div>
                <div>
                    <button onClick={(event) => this.register(event)}>Sign Up</button>
                </div>
            </Aux>
        );
    }
}

export default SignUp;
