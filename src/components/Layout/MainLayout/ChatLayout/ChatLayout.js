import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {API} from "../../../../globals/methods";
import {ActionTypes, Constants, Screens} from "../../../../globals/constants";
import Loading from "../../../Loading/Loading";
import SendMessage from "./SendMessage";
import Grid from "@material-ui/core/Grid/Grid";
import MessagePreview from "./MessagePreview/MessagePreview";
import Typography from "@material-ui/core/Typography/Typography";
import BackButton from "../../../Buttons/BackButton";

const styles = theme => ({
    root: {
        display: "flex"
    },
    chatHeading: {
        fontSize: "4vh",
        fontWeight: "bold",
        marginTop: "1vh",
        marginBottom: "1vh",
        flex: 9
    },
    messages: {
        display: "inline-block",
        flex: 8,
        overflow: "auto"
    },
    textField: {
        flex: 8
    },
    sendMessageGrid: {
        marginBottom: "2vh"
    },
    sendMessageButton: {
        marginLeft: "3vh",
        padding: 0
    },
    back: {
        flex: 1
    },
    backButton: {
        padding: 0
    }
});

class ChatLayout extends Component {
    state = {
        text: "",
        limit: Constants.LIMIT
    };

    scrollToLastMessage() {
        this.messagesComponent.scrollTop = this.messagesComponent.scrollHeight;
    }

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
                this.scrollToLastMessage();
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
        this.scrollToLastMessage();
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
                <Grid container justify="center" alignItems="center">
                    <Grid item className={this.props.classes.back}>
                        <BackButton className={this.props.classes.backButton} clicked={() => {
                            this.props.changeScreen(Screens.CHAT_LIST)
                        }}/>
                    </Grid>
                    <Grid item className={this.props.classes.chatHeading}>
                        <Typography variant="h6">{this.props.receiver.username}</Typography>
                    </Grid>
                </Grid>
                <Grid
                    ref={(ref) => this.messagesComponent = ref}
                    container
                    direction="column"
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
                    <SendMessage />
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChatLayout));
