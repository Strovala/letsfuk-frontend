import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {styles} from "../LastMessagePreview";
import {withStyles} from "@material-ui/core";

const stationMessagePreview = (props) => (
    <Grid container direction="column" className={props.className}>
        <Typography variant="h6" className={props.classes.receiver}>
            {props.username}
        </Typography>
        <Grid container direction="column">
            <Typography variant="body1" className={props.classes.sender}>
                {props.sender}:
            </Typography>
            <Typography variant="body2" className={props.classes.text}>
                {props.message}
            </Typography>
        </Grid>
    </Grid>
);

export default withStyles(styles)(stationMessagePreview);