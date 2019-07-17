import React  from 'react';
import {connect} from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";
import LandingLayout from "./components/Layout/LandingLayout/LandingLayout";
import MainLayout from "./components/Layout/MainLayout/MainLayout";

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        }
    },
    container: {
        display: 'flex'
    }
});

const app = (props) => {
    const layout = props.authenticated ? <MainLayout/> : <LandingLayout/>;
    return (
        <Container component="main" maxWidth="xs" className={props.classes.container} >
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

export default withStyles(styles)(connect(mapStateToProps)(app));
