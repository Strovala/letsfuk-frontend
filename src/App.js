import React, { Component } from 'react';
import Layout from './components/Layout/Layout';

const Screens = {
    LOGIN: "login",
    SIGNUP: "signup",
    CHATLIST: 'chatList',
    CHAT: 'chat'
};

const ScreenContext = React.createContext({
    currentScreen: Screens.SIGNUP
});

const UserContext = React.createContext({
    currentUser: null
});

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
            <UserContext.Provider value={this.state.currentUser}>
                <ScreenContext.Provider value={this.state.currentScreen}>
                    <Layout
                        changeScreen={(screen) => (this.changeScreen(screen))}
                        changeUser={(user) => (this.changeUser(user))}
                    />
                </ScreenContext.Provider>
            </UserContext.Provider>
        );
    }
}

export default App;
export { ScreenContext, UserContext, Screens };
