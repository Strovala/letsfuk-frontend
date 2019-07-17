import Grid from "@material-ui/core/Grid/Grid";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {formatSentAt} from "../../../../../globals/methods";

const messagePreview = (props) => {
    return (
        <Grid container direction="column" style={{
            direction: "ltr",
            transform: "rotate(180deg)",
            backgroundColor: "rgb(63,81,181, 0.4)",
            marginTop: "8px", width: "75%",
            border: "1px solid black",
            borderRadius: "5%"
        }}>
            <Grid item>
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
    )
};


export default messagePreview;