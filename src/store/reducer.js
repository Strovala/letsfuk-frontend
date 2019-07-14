import {ActionTypes, Screens} from "../App";

const initialState = {
    screen: Screens.LOGIN,
    user: null,
    receiver: null,
    webSocket: null,
    isStation: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SCREEN_CHANGE:
            return {
                ...state,
                screen: action.screen
            };
        default:
            return state;
    }
};

export default reducer;
