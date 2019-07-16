import Grid from "@material-ui/core/Grid/Grid";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import {withStyles} from "@material-ui/core";
import {styles} from "../../MainLayout";
import {ActionTypes} from "../../../../globals/constants";
import {connect} from "react-redux";

const chatPreview = (props) => {
    let lastMessage = props.chat.messages[props.chat.messages.length-1];
    let messagePreview = (
        <Grid container direction="column" style={{flex: 3}}>
            <Grid item style={{flex: 2}}>
                <Typography variant="h6">
                    {props.chat.receiver.username}
                </Typography>
            </Grid>
            <Grid item style={{flex: 1}}>
                <Typography variant="body2">
                    {lastMessage.text}
                </Typography>
            </Grid>
        </Grid>
    );
    // Need to
    if (props.chat.receiver.isStation) {
        messagePreview = (
            <Grid container direction="column" style={{flex: 3}}>
                <Grid item style={{flex: 1}}>
                    <Typography variant="h6" style={{lineHeight: 1}}>
                        {props.chat.receiver.username}
                    </Typography>
                </Grid>
                <Grid container direction="column">
                    <Grid item style={{flex: 1}}>
                        <Typography variant="body1" style={{lineHeight: 1}}>
                            {lastMessage.sender.username}:
                        </Typography>
                    </Grid>
                    <Grid item style={{flex: 1}}>
                        <Typography variant="body2" style={{lineHeight: 1}}>
                            {lastMessage.text}
                        </Typography>
                    </Grid>
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
                <Avatar className={props.classes.avatarGrid.avatar}>H</Avatar>
            </Grid>
            {messagePreview}
            <Grid container justify="flex-end" className={props.classes.timeGrid}>
                <Typography variant="subtitle1">Time</Typography>
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