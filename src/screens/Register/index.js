import React, {Component} from 'react';
import {connect} from "react-redux";
import IconPlaceholderInput from "../Login/IconPlaceholderInput";
import Button from "../../components/Button";
import Popup from "../../components/Popup";
import Spinner from "../../components/Spinner";
import {ActionTypes, Screens} from "../../globals/constants";
import {API} from "../../globals/methods";
import './Register.scss';

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        error: null,
        loader: false
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

    handleLoader(value) {
        this.setState({
            loader: value
        })
    }

    componentDidMount() {
        // In case user somehow land on SignUp page while he is logged in
        API.whoAmI({
            response: response => {
                this.props.changeUser(response.data);
                this.props.changeAuthenticated(true);
                this.props.changeScreen(Screens.MESSAGES);
            },
        });
    }

    onRegisterClick(event) {
        if (!this.state.username || !this.state.email || !this.state.password)
            return;
        let data = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        };
        event.preventDefault();
        this.handleLoader(true);
        API.register({
            data: data,
            response: () => {
                this.props.changeScreen(Screens.LOGIN);
                this.handleLoader(false);
            },
            error: error => {
                if (error.response)
                    this.handleError(error.response.data);
                this.handleLoader(false);
            }
        });
    }

    render () {
        let utilityClass = "";
        let formError = null;
        let popup = null;
        if (this.state.error) {
            utilityClass = "u-margin-bottom-0";
            formError = (
                <div className={`form__group ${utilityClass}`}>
                    <div className="form__error">
                        {this.state.error.text}
                    </div>
                </div>
            );
        }
        if (this.state.loader) {
            popup = (
                <Popup className="popup--active">
                    <Spinner/>
                </Popup>
            )
        }
        const passwordInput = (
            <div className={`form__group ${utilityClass}`}>
                <IconPlaceholderInput
                    spanClassName="form__input-icon"
                    iconClassName="fas fa-lock"
                    inputProps={{
                        type: "password",
                        placeholder: "Password",
                        id: "password",
                        required: true,
                        className: "form__input",
                        value: this.state.password,
                        onChange: (event) => this.handlePassword(event)
                    }}
                />
            </div>
        );
        return (
            <div className="register">
                {popup}
                <div className="register__header">
                    <h2 className="register__heading-primary">Letsfuk</h2>
                    <h3 className="register__heading-secondary">Create new
                        account</h3>
                </div>
                <form className="form">
                    <div className="form__group">
                        <IconPlaceholderInput
                            spanClassName="form__input-icon"
                            iconClassName="fas fa-user"
                            inputProps={{
                                type: "username",
                                placeholder: "Username",
                                id: "username",
                                required: true,
                                className: "form__input",
                                value: this.state.username,
                                onChange: (event) => this.handleUsername(event)
                            }}
                        />
                    </div>
                    <div className="form__group">
                        <IconPlaceholderInput
                            spanClassName="form__input-icon"
                            iconClassName="fas fa-envelope"
                            inputProps={{
                                type: "email",
                                placeholder: "Email address",
                                id: "email",
                                required: true,
                                className: "form__input",
                                value: this.state.email,
                                onChange: (event) => this.handleEmail(event)
                            }}
                        />
                    </div>
                    {passwordInput}
                    {formError}
                    <div className="form__group">
                        <Button className="form__button" onClick={event => this.onRegisterClick(event)}>Continue &rarr;</Button>
                    </div>
                    <p className="form__account-check">
                        Already have account?&nbsp;
                        <button className="form__link" onClick={() => this.props.changeScreen(Screens.LOGIN)}>Log in</button>
                    </p>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(Register);