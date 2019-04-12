import React, { Component } from 'react';
import Layout from './components/Layout/Layout';

const Screens = {
    LOGIN: "login",
    SIGNUP: "signup",
    CHATLIST: 'chatList',
    CHAT: 'chat'
};

class App extends Component {
    state = {
        currentScreen: Screens.SIGNUP,
        currentUser: null
    };

    changeScreen(value) {
        this.setState({
            currentScreen: value
        })
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
                changeScreen={(screen) => (this.changeScreen(screen))}
                changeUser={(user) => (this.changeUser(user))}
            />
        );
    }
}

export default App;
export { Screens };
