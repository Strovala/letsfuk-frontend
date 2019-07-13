import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import Layout from './components/Layout/Layout';
import FancyWebSocket from "./fancyWebSocket";

const Screens = {
    LOGIN: "login",
    SIGNUP: "signup",
    CHATLIST: 'chatList',
    CHAT: 'chat'
};

const Constants = {
    LIMIT: 20
};

const webSocketAddress = "ws://localhost:8888/websocket";

const cookies = new Cookies();

class App extends Component {
    state = {
        currentScreen: Screens.LOGIN,
        currentUser: null,
        currentReceiver: null,
        webSocket: null,
        isStation: false
    };

    changeScreen(value) {
        let newState = {
            currentScreen: value
        };
        this.setState(newState);
    }

    changeIsStation(value) {
        this.setState({
            isStation: value
        })
    }

    changeWebSocket(value) {
        this.setState({
            webSocket: value
        })
    }

    changeUser(value) {
        this.setState({
            currentUser: value
        })
    }

    changeReceiver(value) {
        this.setState({
            currentReceiver: value
        })
    }

    initWebSocket(userId) {
        let webSocket = new FancyWebSocket(webSocketAddress);
        webSocket.bind('open', function(data){
            webSocket.send('connect', {
                id: userId
            });
        });
        return webSocket;
    }

    getUserId2() {
        let userId;
        try {
            userId = this.state.currentUser.user.userId;
        } catch (e) {
        }
        return userId;
    }

    getUserId() {
        let userId;
        try {
            userId = this.state.currentUser.userId;
            if (!userId)
                userId = this.getUserId2();
        } catch (e) {
            userId = this.getUserId2();
        }
        return userId;
    }

    render() {
        return (
            <Layout
                screen={this.state.currentScreen}
                user={this.state.currentUser}
                changeScreen={(screen) => (this.changeScreen(screen))}
                changeUser={(user) => (this.changeUser(user))}
                webSocketAddress={webSocketAddress}
                initWebSocket={(userId) => (this.initWebSocket(userId))}
                getUserId={() => this.getUserId()}
                receiver={this.state.currentReceiver}
                changeReceiver={(value) => this.changeReceiver(value)}
                webSocket={this.state.webSocket}
                changeWebSocket={(value) => this.changeWebSocket(value)}
                isStation={this.state.isStation}
                changeIsStation={(value) => this.changeIsStation(value)}
            />
        );
    }
}

export default App;
export { Screens, Constants, cookies };
