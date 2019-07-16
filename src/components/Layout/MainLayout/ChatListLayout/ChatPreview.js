import Grid from "@material-ui/core/Grid/Grid";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import {withStyles} from "@material-ui/core";
import {styles} from "../../MainLayout";
import {ActionTypes} from "../../../../globals/constants";
import {connect} from "react-redux";
import {formatSentAt} from "../../../../globals/methods";

const chatPreview = (props) => {
    let lastMessage = props.chat.messages[props.chat.messages.length-1];
    let lineHeightStyle = null;
    let messagePreview = (
        <Grid item >
            <Typography variant="body2">
                {lastMessage.text}
            </Typography>
        </Grid>
    );
    // Here we need to shrink line height style in order for text
    // to fit as regular chat
    // Also need to add sender username for group chat
    // because receiver username is `Station`
    if (props.chat.receiver.isStation) {
        lineHeightStyle = {lineHeight: 1};
        messagePreview = (
            <Grid container direction="column">
                <Grid item>
                    <Typography variant="body1" style={lineHeightStyle}>
                        {lastMessage.sender.username}:
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2" style={lineHeightStyle}>
                        {lastMessage.text}
                    </Typography>
                </Grid>
            </Grid>
        )
    }
    return (
        <Grid container direction="row" spacing={2} className={props.classes.chats}>
            <Grid
                container
                justify="center"
                alignItems="center"
                className={props.classes.avatarGrid}
            >
                <Avatar className={props.classes.avatarGrid.avatar}>
                    {props.chat.receiver.username.toUpperCase()[0]}
                </Avatar>
            </Grid>

            <Grid container direction="column" className={props.classes.messagesGrid}>
                <Grid item >
                    <Typography variant="h6" style={lineHeightStyle}>
                        {props.chat.receiver.username}
                    </Typography>
                </Grid>
                {messagePreview}
            </Grid>
            <Grid container justify="flex-end" className={props.classes.timeGrid}>
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