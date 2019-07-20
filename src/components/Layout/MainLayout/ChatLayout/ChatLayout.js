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
        limit: Constants.LIMIT,
        loadedAll: false
    };

    scrollToLastMessage() {
        if (this.messagesComponent)
            this.messagesComponent.scrollTop = this.messagesComponent.scrollHeight;
    }

    loadMoreMessages() {
        const newLimit = this.state.limit + Constants.LIMIT;
        API.getMessages({
            user: this.props.user,
            receiverId: this.props.receiver.id,
            limit: newLimit,
            response: response => {
                if (!this._ismounted) return;
                let messages = response.data.messages;
                if (messages.length === this.props.chat.messages.length) {
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

    getMessages() {
        this.getMessagesFromBackend();
        if (this.props.receiver.isStation)
            this.resetUnreadMessages(this.props.receiver.id, undefined);
        else {
            this.resetUnreadMessages(undefined, this.props.receiver.id);
        }
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
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getMessages();
            that.getChats();
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
            this.scrollTriggerer = null;
            this.loadMoreMessages();
        }
    }

    isTriggererInViewport(offset = 0) {
        if (this.state.loadedAll) return false;
        if (!this.scrollTriggerer) return false;
        const top = this.scrollTriggerer.getBoundingClientRect().top;
        return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
    }

    setScrollTriggerrer(value) {
        this.scrollTriggerer = value;
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
                    id="scroll-msgs"
                    ref={(ref) => {
                        this.messagesComponent = ref;
                    }}
                    onScroll={() => this.scrollHandler()}
                    container
                    direction="column"
                    className={this.props.classes.messages}
                >
                    {this.props.chat.messages.map((message, index) => {
                        return (
                            <MessagePreview
                                id={`${index}_el`}
                                // 5th message from top triggers loading more messages
                                setRef={(ref) => index === Constants.TRIGGER_MESSAGE_INDEX ? this.setScrollTriggerrer(ref): null}
                                key={message.messageId}
                                message={message}
                                receiver={this.props.chat.receiver}
                            />
                        );
                    })}
                </Grid>
                <Grid container direction="row" className={this.props.classes.sendMessageGrid}>
                    <SendMessage getMessages={() => {
                        this.getMessages();
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
