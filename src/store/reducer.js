import {ActionTypes, Screens} from "../globals/constants";


const initialState = {
    authenticated: false,
    screen: Screens.LOGIN,
    user: null,
    receiver: null,
    webSocket: null,
    chats: null,
    stationChat: null,
    activeChat: null,
    notificationsEnabled: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SCREEN_CHANGE:
            return {
                ...state,
                screen: action.value
            };
        case ActionTypes.WEBSOCKET_CHANGE:
            return {
                ...state,
                webSocket: action.value
            };
        case ActionTypes.USER_CHANGE:
            return {
                ...state,
                user: action.value
            };
        case ActionTypes.RECEIVER_CHANGE:
            return {
                ...state,
                receiver: action.value
            };
        case ActionTypes.CHATS_CHANGE:
            return {
                ...state,
                chats: action.value
            };
        case ActionTypes.ACTIVE_CHAT_CHANGE:
            return {
                ...state,
                activeChat: action.value
            };
        case ActionTypes.ACTIVE_STAION_CHANGE:
            return {
                ...state,
                activeStation: action.value
            };
        case ActionTypes.AUTHENTICATED_CHANGE:
            return {
                ...state,
                authenticated: action.value
            };
        case ActionTypes.NOTIFICATIONS_ENABLED_CHANGE:
            return {
                ...state,
                notificationsEnabled: action.value
            };
        default:
            return state;
    }
};

export default reducer;
