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
import humps from "humps";

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
        limit: Constants.MESSAGES_LIMIT,
        loadedAll: false
    };

    scrollToLastMessage() {
        if (this.scrollComponent)
            this.scrollComponent.scrollTop = this.scrollComponent.scrollHeight;
    }

    loadMoreMessages() {
        const newLimit = this.state.limit + Constants.MESSAGES_LIMIT;
        API.getMessages({
            user: this.props.user,
            receiverId: this.props.receiver.id,
            limit: newLimit,
            response: response => {
                if (!this._ismounted) return;
                let messages = response.data.messages;
                const totalString = response.headers[Constants.X_TOTAL_HEADER];
                const total = parseInt(totalString);
                if (messages.length === total) {
                    this.setState({
                        loadedAll: true
                    });
                }
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
                this.setState({
                    limit: newLimit
                });
            }
        });
    }

    getMessagesFromBackend(limit) {
        limit = limit || this.state.limit;
        API.getMessages({
            user: this.props.user,
            receiverId: this.props.receiver.id,
            limit: limit,
            response: response => {
                if (!this._ismounted) return;
                this.setState({
                    limit: limit
                });
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
            data: data,
            response: () => {
                this.getChats()
            }
        });
    }

    resetUnreads() {
        if (this.props.receiver.isStation)
            this.resetUnreadMessages(this.props.receiver.id, undefined);
        else {
            this.resetUnreadMessages(undefined, this.props.receiver.id);
        }
    }

    getMessages() {
        this.getMessagesFromBackend();
        this.resetUnreads();
    }

    getChats() {
        API.getChats({
            user: this.props.user,
            response: response => {
                this.props.setChats(response.data);
                this.props.changeActiveStation(response.data.stationChat.receiver);
            }
        });
    }

    componentDidMount() {
        this._ismounted = true;
        this.getMessages();
        this.props.webSocket.bind('message', (data) => {
            if (!this._ismounted)
                return;
            data = humps.camelizeKeys(data);
            // If one who sent message is receiver in this private chat
            // Station will never be sender
            if (data.sender.userId === this.props.receiver.id) {
                // Just update sent message to chats
                let messages = this.props.chat.messages;
                messages.push(data);
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
                this.resetUnreads();
                this.scrollToLastMessage();
            } else {
                this.getChats();
            }
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

    scrollHandler() {
        const isIn = this.isTriggererInViewport();
        if (isIn) {
            this.triggers = [];
            this.loadMoreMessages();
        }
    }

    isTriggererInViewport(offset = 0) {
        if (this.state.loadedAll) return false;
        if (this.triggers.length === 0) return false;
        return this.triggers.some((trigger) => {
            const top = trigger.getBoundingClientRect().top;
            return (top + offset) >= 0 && (top - offset) <= window.innerHeight
        });
    }

    setTrigger(value) {
        if (!value)
            return;
        if (!this.triggers)
            this.triggers = [];
        this.triggers.push(value);
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
                            this.props.changeScreen(Screens.MESSAGES)
                        }}/>
                    </Grid>
                    <Grid item className={this.props.classes.chatHeading}>
                        <Typography variant="h6">{this.props.receiver.username}</Typography>
                    </Grid>
                </Grid>
                <Grid
                    id="scroll-msgs"
                    ref={(ref) => {
                        this.scrollComponent = ref;
                    }}
                    // Skip this for now, as I'm gonna get messages with no limit for now
                    onScroll={() => this.scrollHandler()}
                    container
                    direction="column"
                    className={this.props.classes.messages}
                >
                    {this.props.chat.messages.map((message, index) => {
                        const shouldBeTrigger = 0 <= index <= Constants.TRIGGER_MESSAGE_INDEXES_COUNT;
                        return (
                            <MessagePreview
                                // Messages with indexed trigger loading more messages
                                setTrigger={(ref) => shouldBeTrigger ? this.setTrigger(ref): null}
                                key={message.messageId}
                                message={message}
                                prevMessage={index !== 0 ? this.props.chat.messages[index-1]: null}
                                receiver={this.props.chat.receiver}
                            />
                        );
                    })}
                </Grid>
                <Grid container direction="row" className={this.props.classes.sendMessageGrid}>
                    <SendMessage afterSending={(data) => {
                        // Just update sent message to chats
                        let messages = this.props.chat.messages;
                        messages.push(data);
                        this.props.changeActiveChat({
                            ...this.props.chat,
                            messages: messages
                        });
                        this.getChats();
                        this.scrollToLastMessage();
                    }}/>
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
        webSocket: state.webSocket,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value}),
        setChats: (value) => dispatch({type: ActionTypes.CHATS_CHANGE, value: value}),
        changeActiveStation: (value) => dispatch({type: ActionTypes.ACTIVE_STAION_CHANGE, value: value})
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChatLayout));
