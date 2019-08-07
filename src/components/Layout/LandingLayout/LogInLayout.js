import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import Typography from '@material-ui/core/Typography';
import {styles} from "../LandingLayout";
import LoginButton from "../../Buttons/LoginButton";
import SignUpLayoutButton from "../../Buttons/SignUpLayoutButton";
import TextError from "../../Errors/TextError";
import {withStyles} from "@material-ui/core";
import {API} from "../../../globals/methods";
import {initWebSocket} from "../../../fancyWebSocket";
import {ActionTypes, Screens} from "../../../globals/constants";
import {connect} from "react-redux";


class LogIn extends Component {
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

    componentDidMount() {
        // redirect to home page if user is logged in
        API.whoAmI({
            response: response => {
                const webSocket = initWebSocket(response.data.user.userId);
                this.props.changeWebSocket(webSocket);
                // This needs to go after webSocket change
                // because it will load ChatList screens before its ready
                this.props.changeAuthenticated(true);
                this.props.changeScreen(Screens.MESSAGES);
                this.props.changeUser(response.data);
            },
        });
    }

    render() {
        return (
            <div className={this.props.classes.paper}>
                <Avatar className={this.props.classes.avatar}>
                    <LabelImportantIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <div className={this.props.classes.form}>
                    <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="credentials"
                        label="Username / Email address"
                        autoComplete="username"
                        autoFocus
                        inputProps={{
                            value: this.state.credentials,
                            onChange: (event) => this.handleCredentials(event)
                        }}
                    />
                    <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        inputProps={{
                            value: this.state.password,
                            onChange: (event) => this.handlePassword(event)
                        }}
                    />
                    <LoginButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={this.props.classes.submit}
                        onError={(error) => this.handleError(error)}
                        data={{...this.state}}
                    />
                    <TextError error={this.state.error}/>
                    <SignUpLayoutButton
                        variant="body2"
                        component="button"
                        className={this.props.classes.link}>
                    </SignUpLayoutButton>
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(LogIn));
