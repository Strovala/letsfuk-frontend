import React from 'react';
import Typography from "@material-ui/core/Typography/Typography";

const textError = (props) => (
    props.error ? (
        <Typography variant="body1" color="secondary">
            {props.error.text}
        </Typography>
    ): null
);

export default textError;