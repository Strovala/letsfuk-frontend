import Grid from "@material-ui/core/Grid/Grid";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import {withStyles} from "@material-ui/core";
import {ActionTypes, Screens} from "../../../../../globals/constants";
import {connect} from "react-redux";
import {formatSentAtForChatList} from "../../../../../globals/methods";
import MessagePreview from "./LastMessagePreview/MessagePreview";
import {deepPurple} from "@material-ui/core/colors";

const styles = (theme) => ({
    root: {
        borderTop: "1px solid",
        paddingTop: "1vh",
        marginTop: "1vh",
        marginBottom: "0.3vh",
        borderColor: "rgb(170,170,170, 0.7)",
        flex: "0 0 50px"
    },
    avatarGrid: {
        flex: 1,
    },
    messageGrid: {
        flex: 3,
    },
    messageGridInside: {
        display: "inline-block"
    },
    timeGrid: {
        flex: 1
    },
    unreadGrid: {
        flex: 1
    },
    time: {
        paddingRight: "4vh",
        flex: 1,
    },
    avatar: {
        color: '#fff',
        backgroundColor: deepPurple[500],
    },
    unread: {
        backgroundColor: "#FF0000",
        width: "20px",
        height: "20px",
        fontSize: "14px",
        fontWeight: "bold",
        color: '#fff',
        borderRadius: "50%",
        marginRight: "8px",
    },
    sentAt: {
        fontSize: "0.8rem"
    }
});

const chatPreview = (props) => {
    let lastMessage = props.chat.messages[props.chat.messages.length - 1];
    let unread = null;
    if (props.chat.unread)
        unread = (
            <Grid container justify="center" className={props.classes.unreadGrid}>
                <Grid container justify="center" alignItems="center" className={props.classes.unread}>
                    {props.chat.unread}
                </Grid>
            </Grid>
        );
    return (
        <Grid
            container direction="row" spacing={2} className={props.classes.root}
            onClick={() => {
                props.changeActiveChat(props.chat);
                props.changeReceiver(props.chat.receiver);
                props.changeScreen(Screens.CHAT)
            }}
            ref={
              (ref) => props.setTrigger ? props.setTrigger(ref): null
            }
        >
            <Grid
                container
                justify="center"
                alignItems="center"
                className={props.classes.avatarGrid}
            >
                <Avatar className={props.classes.avatar}>
                    {props.chat.receiver.username.substring(0, 2).toUpperCase()}
                </Avatar>
            </Grid>
            <Grid container justify="center" alignItems="center" className={props.classes.messageGrid}>
                <MessagePreview
                    className={props.classes.messageGridInside}
                    isStation={props.chat.receiver.isStation}
                    username={props.chat.receiver.username}
                    sender={lastMessage.sender.username}
                    message={lastMessage.text}
                />
            </Grid>
            <Grid container direction="column" className={props.classes.timeGrid}>
                <Grid container justify="center" alignItems="center" className={props.classes.time}>
                    <Typography variant="body1" className={props.classes.sentAt}>{formatSentAtForChatList(lastMessage.sentAt)}</Typography>
                </Grid>
                {unread}
            </Grid>
        </Grid>
    )
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value})
    }
};

export default withStyles(styles)((connect(null, mapDispatchToProps))(chatPreview));