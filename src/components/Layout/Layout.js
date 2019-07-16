import React from 'react';
import SignupLayout from "./LandingLayout/SignUpLayout";
import LoginLayout from "./LandingLayout/LogInLayout";
import {connect} from "react-redux";
import {Screens} from "../../globals/constants";
import ChatLayout from "./MainLayout/ChatLayout";
import ChatListLayout from "./MainLayout/ChatListLayout";
import Container from "@material-ui/core/Container/Container";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

const layout = (props) => {
    let { screen } = props;
    let specificScreen = <LoginLayout />;
    switch (screen) {
        case (Screens.LOGIN):
            specificScreen = <LoginLayout />;
            break;
        case (Screens.SIGNUP):
            specificScreen = <SignupLayout />;
            break;
        case (Screens.CHAT_LIST):
            specificScreen = <ChatListLayout />;
            break;
        case (Screens.CHAT):
            specificScreen = <ChatLayout />;
            break;
        default:
            break;
    }
    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            {specificScreen}
        </Container>
    );
};

const mapStateToProps = state => {
    return {
        screen: state.screen
    }
};

export default connect(mapStateToProps)(layout);
