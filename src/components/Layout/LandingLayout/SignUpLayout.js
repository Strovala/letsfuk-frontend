import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import Typography from '@material-ui/core/Typography';
import {styles} from "../LandingLayout";
import LoginLayoutButton from "../../Buttons/LoginLayoutButton";
import RegisterButton from "../../Buttons/RegisterButton";
import {withStyles} from "@material-ui/core";
import TextError from "../../Errors/TextError";
import {API} from "../../../globals/methods";
import {ActionTypes, Screens} from "../../../globals/constants";
import {connect} from "react-redux";


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

    componentDidMount() {
        // In case user somehow land on SignUp page while he is logged in
        API.whoAmI({
            response: response => {
                this.props.changeAuthenticated(true);
                this.props.changeUser(response.data);
                this.props.changeScreen(Screens.CHAT_LIST);
            },
        });
    }

    render () {
        return (
            <div className={this.props.classes.paper}>
                <Avatar className={this.props.classes.avatar}>
                    <LabelImportantIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <div className={this.props.classes.form}>
                    <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        autoComplete="username"
                        autoFocus
                        inputProps={{
                            value: this.state.username,
                            onChange: (event) => this.handleUsername(event)
                        }}
                    />
                    <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email address"
                        autoComplete="email"
                        inputProps={{
                            value: this.state.email,
                            onChange: (event) => this.handleEmail(event)
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
                    <RegisterButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={this.props.classes.submit}
                        onError={(error) => this.handleError(error)}
                        data={{...this.state}}
                    />
                    <TextError error={this.state.error}/>
                    <LoginLayoutButton
                        variant="body2"
                        component="button"
                        className={this.props.classes.link}
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeScreen: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(SignUp));