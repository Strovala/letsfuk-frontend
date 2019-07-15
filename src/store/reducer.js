import {ActionTypes, Screens} from "../globals/constants";


const initialState = {
    screen: Screens.LOGIN,
    user: null,
    receiver: null,
    webSocket: null,
    chats: null,
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
        case ActionTypes.ACTIVE_CHAT_CHANGE:
            return {
                ...state,
                activeChat: action.chat
            };
        case ActionTypes.ACTIVE_STAION_CHANGE:
            return {
                ...state,
                activeStation: action.station
            };
        default:
            return state;
    }
};

export default reducer;
