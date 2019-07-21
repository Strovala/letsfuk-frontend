import Cookies from "universal-cookie";

const ActionTypes = {
    SCREEN_CHANGE: "SCREEN_CHANGE",
    WEBSOCKET_CHANGE: "WEBSOCKET_CHANGE",
    USER_CHANGE: "USER_CHANGE",
    RECEIVER_CHANGE: "RECEIVER_CHANGE",
    CHATS_CHANGE: "CHATS_CHANGE",
    ACTIVE_CHAT_CHANGE: "ACTIVE_CHAT_CHANGE",
    ACTIVE_STAION_CHANGE: "ACTIVE_STAION_CHANGE",
    AUTHENTICATED_CHANGE: "AUTHENTICATED_CHANGE"
};

const Screens = {
    LOGIN: "login",
    SIGNUP: "signup",
    CHAT_LIST: 'chatList',
    CHAT: 'chat'
};

const Constants = {
    LIMIT: 100,
    TRIGGER_MESSAGE_INDEXES: [0, 1, 2, 3, 4, 5]
};

const https = true ;
const dev = false;
const apiSecure = https ? 'https': 'http';
const apiHost = 'euve258483.serverprofi24.net';
const apiPort = 443;
const internalPort = 8888;
const webSocketUrl = dev ? 'ws://localhost:8888/websocket': `wss://${apiHost}:${internalPort}/websocket`;
const apiUrl = dev ? `http://localhost:8888`: `${apiSecure}://${apiHost}:${apiPort}/api`;
const cookies = new Cookies();

export {
    Screens, ActionTypes, Constants, cookies,
    webSocketUrl, apiUrl
};

