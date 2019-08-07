import React, {Component} from 'react';
import {connect} from "react-redux";
import './Login.scss';
import '../../sass/utilities.scss';
import {ActionTypes, cookies, Screens} from "../../globals/constants";
import {API} from "../../globals/methods";
import {initWebSocket} from "../../fancyWebSocket";
import Button from "../../components/Button";
import IconPlaceholderInput from "./IconPlaceholderInput";
import Spinner from '../../components/Spinner';
import Popup from '../../components/Popup';

class LogIn extends Component {
    state = {
        credentials: "",
        password: "",
        error: null,
        loader: false,
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

    handleLoader(value) {
        this.setState({
            loader: value
        })
    }

    componentDidMount() {
        // redirect to home page if user is logged in
        API.whoAmI({
            response: response => {
                const webSocket = initWebSocket(response.data.user.userId);
                this.props.changeWebSocket(webSocket);
                // This needs to go after webSocket change
                // because it will load ChatList screens before its ready
                this.props.changeAuthenticated(true);
                this.props.changeScreen(Screens.CHAT_LIST);
                this.props.changeUser(response.data);
            },
        });
    }

    onLoginClick(event) {
        if (!this.state.credentials || !this.state.password)
            return;
        let data = {
            username: this.state.credentials,
            email: this.state.credentials,
            password: this.state.password,
            lat: "",
            lon: ""
        };
        event.preventDefault();
        this.handleLoader(true);
        navigator.geolocation.getCurrentPosition((location) => {
            data.lat = location.coords.latitude;
            data.lon = location.coords.longitude;
            API.login({
                data: data,
                response: response => {
                    const userId = response.data.user.userId;
                    cookies.set('session-id', response.data.sessionId);
                    cookies.set('user-id', userId);
                    this.props.changeUser(response.data);
                    const webSocket = initWebSocket(userId);
                    this.props.changeWebSocket(webSocket);
                    // This needs to go after webSocket change
                    // because it will load ChatList screens before its ready
                    this.props.changeAuthenticated(true);
                    this.props.changeScreen(Screens.CHAT_LIST);
                    // In order to cache
                    API.whoAmI();
                    this.handleLoader(false);
                },
                error: error => {
                    if (error.response)
                        this.handleError(error.response.data);
                    this.handleLoader(false);
                }
            });
        }, (err) => {
            this.handleError({
                text: err.message
            });
            this.handleLoader(false);
        }, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    }

    render() {
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
        const passwordInput = (
            <div className={`form__group ${utilityClass}`}>
                <IconPlaceholderInput
                    iconClassName="fas fa-lock"
                    inputProps={{
                        type: "password",
                        placeholder: "Password",
                        id: "password",
                        required: true,
                        value: this.state.password,
                        onChange: (event) => this.handlePassword(event)
                    }}
                />
            </div>
        );
        if (this.state.loader) {
            popup = (
                <Popup className="popup--active">
                    <Spinner/>
                </Popup>
            )
        }
        return (
            <div className="login" >
                {popup}
                <div className="login__header">
                    <div className="login__heading">
                        <h1 className="login__heading-title">Letsfuk</h1>
                        <p className="login__heading-message">Welcome! Log in to your account</p>
                    </div>
                </div>
                <div className="login__content">
                    <form className="form">
                        <div className="form__group">
                            <IconPlaceholderInput
                                iconClassName="fas fa-user"
                                inputProps={{
                                    type: "username",
                                    placeholder: "Username / email",
                                    id: "username",
                                    required: true,
                                    value: this.state.credentials,
                                    onChange: (event) => this.handleCredentials(event)
                                }}
                            />
                        </div>
                        {passwordInput}
                        {formError}
                        <div className="form__group">
                            <Button className="form__button" onClick={event => this.onLoginClick(event)}>Login</Button>
                        </div>
                        <p className="form__account-check">
                            Don't have an account yet?&nbsp;
                            <button className="form__link" onClick={() => this.props.changeScreen(Screens.REGISTER)}>Join now</button>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeWebSocket: (value) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(LogIn);
