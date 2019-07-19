import Grid from "@material-ui/core/Grid/Grid";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {formatSentAt} from "../../../../../globals/methods";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {ActionTypes, Screens} from "../../../../../globals/constants";
import Radium from "radium";

const styles = theme => ({
    root: {
        marginTop: "8px"
    },
    item: {
        width: "75%",
        border: "1px solid black",
        borderRadius: "5%",
    }
});
const messagePreview = (props) => {
    let justifyContent = "flex-start";
    let backgroundColor = "rgb(127,127,181, 0.4)";
    if (props.message.sender.userId === props.user.user.userId) {
        justifyContent = "flex-end";
        backgroundColor = "rgb(63,81,181, 0.4)";
    }
    return (
        <Grid container direction="row" className={props.classes.root} style={{justifyContent: justifyContent}}>
            <Grid container direction="column" className={props.classes.item} style={{backgroundColor: backgroundColor}}>
                <Grid item onClick={() => {
                    if (props.message.sender.userId === props.user.user.userId)
                        return;
                    const receiver = props.message.sender;
                    receiver.id = receiver.userId;
                    props.changeReceiver(receiver);
                    props.changeScreen(Screens.CHAT);
                }}>
                    <Typography variant="body1" style={{lineHeight: 1, fontWeight: "bold", padding: "8px"}}>
                        {props.message.sender.username}
                    </Typography>
                </Grid>
                <Typography variant="subtitle1" style={{lineHeight: 1, wordBreak: "break-word", paddingLeft: "8px"}}>
                    {props.message.text}
                </Typography>
                <Grid container justify="flex-end">
                    <Typography variant="overline" style={{ lineHeight: 1, paddingRight: "8px",paddingBottom: "4px", paddingTop: "4px"}}>
                        {formatSentAt(props.message.sentAt)}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
};

const mapStateToProps = state => {
    return {
        user: state.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Radium(messagePreview)));
