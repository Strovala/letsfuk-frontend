import Grid from "@material-ui/core/Grid/Grid";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import {withStyles} from "@material-ui/core";
import {ActionTypes, Screens} from "../../../../../globals/constants";
import {connect} from "react-redux";
import {formatSentAt} from "../../../../../globals/methods";
import MessagePreview from "./LastMessagePreview/MessagePreview";
import {deepPurple} from "@material-ui/core/colors";

const styles = (theme) => ({
    root: {
        borderTop: "1px solid",
        paddingTop: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderColor: "rgb(170,170,170, 0.7)",
        flex: "0 0 14%",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    avatarGrid: {
        flex: 1,
    },
    messageGrid: {
        flex: 3,
        justifyContent: "center"
    },
    timeGrid: {
        flex: 1,
        paddingRight: theme.spacing(2),
    },
    avatar: {
        color: '#fff',
        backgroundColor: deepPurple[500],
    },
});

const chatPreview = (props) => {
    let lastMessage = props.chat.messages[0];

    return (
        <Grid container direction="row" spacing={2} className={props.classes.root} onClick={() => {
            props.changeActiveChat(props.chat);
            props.changeReceiver(props.chat.receiver);
            props.changeScreen(Screens.CHAT)
        }}>
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
            <MessagePreview
                className={props.classes.messageGrid}
                isStation={props.chat.receiver.isStation}
                username={props.chat.receiver.username}
                sender={lastMessage.sender.username}
                message={lastMessage.text}
            />
            <Grid container justify="flex-end" alignItems="center" className={props.classes.timeGrid}>
                <Typography variant="subtitle1">{formatSentAt(lastMessage.sentAt)}</Typography>
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