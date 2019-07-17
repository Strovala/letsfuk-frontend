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
    LIMIT: 20
};

const https = false ;
const apiSecure = https ? 'https': 'http';
const apiHost = 'localhost';
const apiPort = 8888;
const apiHostPort = `${apiHost}:${apiPort}`;
const webSocketUrl = `ws://${apiHostPort}/websocket`;
const apiUrl = `${apiSecure}://${apiHostPort}`;
const cookies = new Cookies();

export {
    Screens, ActionTypes, Constants, cookies,
    webSocketUrl, apiUrl
};

