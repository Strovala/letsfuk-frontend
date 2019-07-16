import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {styles} from "../LastMessagePreview";
import {withStyles} from "@material-ui/core";

const longMessagePreview = (props) => (
    <Grid container direction="column" className={props.classes.messagesGrid}>
        <Grid item >
            <Typography variant="h6" className={props.classes.singleLineHeight}>
                {props.username}
            </Typography>
        </Grid>
        <Grid item >
            <Typography variant="body2" className={props.classes.singleLineHeight}>
                {props.message}
            </Typography>
        </Grid>
    </Grid>
);

export default withStyles(styles)(longMessagePreview);