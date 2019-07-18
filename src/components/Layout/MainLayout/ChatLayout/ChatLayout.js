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
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton/IconButton";

const styles = theme => ({
    root: {
        display: "flex"
    },
    chatHeading: {
        fontSize: "4vh",
        fontWeight: "bold",
        marginTop: "1vh",
        marginBottom: "1vh",
    },
    messages: {
        flex: 8,
        overflow: "auto",
        direction: "rtl",
        transform: "rotate(180deg)"
    },
    textField: {
        flex: 8
    },
    sendMessageGrid: {
        marginBottom: "2vh"
    }
});

class ChatLayout extends Component {
    state = {
        text: "",
        limit: Constants.LIMIT
    };

    getMessagesFromBackend() {
        API.getMessages({
            user: this.props.user,
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
        let data = {
            station_id: stationId,
            sender_id: senderId,
            count: 0,
        };
        API.resetUnreadMessages({
            user: this.props.user,
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
                    <Typography variant="h6">{this.props.receiver.username}</Typography>
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
                <Grid container direction="row" className={this.props.classes.sendMessageGrid}>
                    <TextField
                        id="standard-multiline-flexible"
                        multiline
                        rowsMax="4"
                        className={this.props.classes.textField}
                        margin="none"
                        autoFocus
                        inputProps={{
                            value: this.state.text,
                            onChange: (event) => this.handleText(event)
                        }}
                    />
                    <SendMessageButton text={this.state.text} clearText={() => this.clearText()}/>
                </Grid>
            </Grid>

        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
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
