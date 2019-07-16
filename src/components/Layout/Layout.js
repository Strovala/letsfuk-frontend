import React from 'react';
import {connect} from "react-redux";
import LandingLayout from "./LandingLayout/LandingLayout";
import MainLayout from "./MainLayout/MainLayout";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
});

const layout = (props) => {
    const layout = props.authenticated ? <MainLayout/> : <LandingLayout/>;
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            {layout}
        </Container>
    )
};

const mapStateToProps = state => {
    return {
        authenticated: state.authenticated
    }
};

export default withStyles(styles)(connect(mapStateToProps)(layout));
