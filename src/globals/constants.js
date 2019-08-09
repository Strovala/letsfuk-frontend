import Cookies from "universal-cookie";

const ActionTypes = {
    SCREEN_CHANGE: "SCREEN_CHANGE",
    WEBSOCKET_CHANGE: "WEBSOCKET_CHANGE",
    USER_CHANGE: "USER_CHANGE",
    RECEIVER_CHANGE: "RECEIVER_CHANGE",
    CHATS_CHANGE: "CHATS_CHANGE",
    ACTIVE_CHAT_CHANGE: "ACTIVE_CHAT_CHANGE",
    ACTIVE_STAION_CHANGE: "ACTIVE_STAION_CHANGE",
    AUTHENTICATED_CHANGE: "AUTHENTICATED_CHANGE",
    JOB_CHANGE: "JOB_CHANGE"
};

const Screens = {
    LOGIN: "login",
    REGISTER: "register",
    MESSAGES: 'messages',
    CHAT: 'chat',
    SETTINGS: 'settings'
};

const Constants = {
    MESSAGES_LIMIT: 100,
    CHATS_LIMIT: 20,
    TRIGGER_MESSAGE_INDEXES_COUNT: 5,
    TRIGGER_CHAT_INDEXES_COUNT: 5,
    DISTANCE_TRESHOLD: 1000,
    X_TOTAL_HEADER: 'x-total'
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

