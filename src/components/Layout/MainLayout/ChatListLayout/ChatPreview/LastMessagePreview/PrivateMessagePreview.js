import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {styles} from "../LastMessagePreview";
import {withStyles} from "@material-ui/core";

const privateMessagePreview = (props) => (
    <Grid container direction="column" className={props.classes.messagesGrid}>
        <Typography variant="h6">
            {props.username}
        </Typography>
        <Typography variant="body2">
            {props.message}
        </Typography>
    </Grid>
);

export default withStyles(styles)(privateMessagePreview);