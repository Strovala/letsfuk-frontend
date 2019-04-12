import React, { Component } from 'react';
import Layout from './components/Layout/Layout';

const Screens = {
    LOGIN: "login",
    SIGNUP: "signup",
    CHATLIST: 'chatList',
    CHAT: 'chat'
};

const Constants = {
    LIMIT: 20
};

class App extends Component {
    state = {
        currentScreen: Screens.LOGIN,
        currentUser: null,
        additionalProps: null
    };

    changeScreen(value, additionalProps) {
        let newState = {
            currentScreen: value
        };
        if (additionalProps) {
            newState.additionalProps = additionalProps;
        }
        this.setState(newState);
    }

    changeUser(value) {
        this.setState({
            currentUser: value
        })
    }

    render() {
        return (
            <Layout
                screen={this.state.currentScreen}
                user={this.state.currentUser}
                changeScreen={(screen, additionalProps) => (this.changeScreen(screen, additionalProps))}
                changeUser={(user) => (this.changeUser(user))}
                additionalProps={this.state.additionalProps}
            />
        );
    }
}

export default App;
export { Screens, Constants };
