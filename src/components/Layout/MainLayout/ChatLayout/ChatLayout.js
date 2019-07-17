import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {API} from "../../../../globals/methods";
import {ActionTypes, Constants, cookies} from "../../../../globals/constants";
import Loading from "../../../Loading/Loading";
import SendMessageButton from "../../../Buttons/SendMessageButton";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import MessagePreview from "./MessagePreview/MessagePreview";
import Typography from "@material-ui/core/Typography/Typography";

const styles = theme => ({
    root: {

    },
    chatHeading: {
        borderBottom: "1px solid",
        paddingBottom: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderColor: "rgb(170,170,170, 0.7)",
        width: "100%"
    },
    messages: {
        flex: 8,
        overflow: "auto",
        direction: "rtl",
        transform: "rotate(180deg)"
    },
    heading: {
        margin: theme.spacing(2)
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
});

class ChatLayout extends Component {
    state = {
        text: "",
        limit: Constants.LIMIT
    };

    getMessagesFromBackend() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        API.getMessages({
            sessionId: sessionId,
            receiverId: this.props.receiver.id,
            limit: this.state.limit,
            response: response => {
                let messages = response.data.messages;
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
            }
        });
    }

    resetUnreadMessages(stationId, senderId) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        let data = {
            station_id: stationId,
            sender_id: senderId,
            count: 0,
        };
        API.resetUnreadMessages({
            sessionId: sessionId,
            data: data
        });
    }

    getMessages() {
        this.getMessagesFromBackend();

        if (this.props.receiver.isStation)
            this.resetUnreadMessages(this.props.receiver.id, undefined);
        else {
            this.resetUnreadMessages(undefined, this.props.receiver.id);
        }
    }

    componentDidMount() {
        this._ismounted = true;
        this.getMessages();
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getMessages();
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.receiver.id !== this.props.receiver.id)
            this.getMessages();
    }

    handleText(event) {
        this.setState({
            text: event.target.value
        })
    }

    clearText() {
        this.setState({
            text: ""
        })
    }

    handleLimit(value) {
        this.setState({
            limit: value
        })
    }

    render() {
        if (!this.props.chat)
            return <Loading />;
        return (
            <Grid
                container
                direction="column"
                className={this.props.classes.root}
            >
                <Grid item className={this.props.classes.chatHeading}>
                    <Typography variant="h3" className={this.props.classes.heading}>{this.props.receiver.username}</Typography>
                </Grid>
                <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    wrap="nowrap"
                    className={this.props.classes.messages}
                >
                    {this.props.chat.messages.map((message) => {
                        return (
                            <MessagePreview
                                key={message.messageId}
                                message={message}
                                receiver={this.props.chat.receiver}
                            />
                        );
                    })}
                </Grid>
                <Grid container>
                    <TextField
                        id="standard-multiline-flexible"
                        label="Multiline"
                        multiline
                        rowsMax="4"
                        className={this.props.classes.textField}
                        margin="normal"
                        inputProps={{
                            value: this.state.text,
                            onChange: (event) => this.handleText(event)
                        }}
                    />
                    <SendMessageButton text={this.state.text} clearText={() => this.clearText()}/>
                </Grid>
            </Grid>
            //     <ScrollMessages limit={this.state.limit} changeLimit={(value) => this.handleLimit(value)}/>

        );
    }
}


const mapStateToProps = state => {
    return {
        chat: state.activeChat,
        receiver: state.receiver,
        limit: state.limit,
        webSocket: state.webSocket,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value})
    }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatLayout));
