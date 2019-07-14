import {ActionTypes, Constants, Screens} from "../globals/constants";


const initialState = {
    screen: Screens.LOGIN,
    user: null,
    receiver: null,
    webSocket: null,
    chats: null,
    credentials: "",
    username: "",
    email: "",
    password: "",
    limit: Constants.LIMIT,
    text: "",
    stationChat: null,
    activeChat: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SCREEN_CHANGE:
            return {
                ...state,
                screen: action.screen
            };
        case ActionTypes.WEBSOCKET_CHANGE:
            return {
                ...state,
                webSocket: action.webSocket
            };
        case ActionTypes.USER_CHANGE:
            return {
                ...state,
                user: action.user
            };
        case ActionTypes.RECEIVER_CHANGE:
            return {
                ...state,
                receiver: action.receiver
            };
        case ActionTypes.CHATS_CHANGE:
            return {
                ...state,
                chats: action.chats
            };
        case ActionTypes.CREDENTIALS_CHANGE:
            return {
                ...state,
                credentials: action.credentials
            };
        case ActionTypes.USERNAME_CHANGE:
            return {
                ...state,
                username: action.username
            };
        case ActionTypes.EMAIL_CHANGE:
            return {
                ...state,
                email: action.email
            };
        case ActionTypes.PASSWORD_CHANGE:
            return {
                ...state,
                password: action.password
            };
        case ActionTypes.TEXT_CHANGE:
            return {
                ...state,
                text: action.text
            };
        case ActionTypes.LIMIT_CHANGE:
            return {
                ...state,
                limit: action.limit
            };
        case ActionTypes.ACTIVE_CHAT_CHANGE:
            return {
                ...state,
                activeChat: action.chat
            };
        case ActionTypes.STATION_CHAT_CHANGE:
            return {
                ...state,
                stationChat: action.stationChat
            };
        default:
            return state;
    }
};

export default reducer;
