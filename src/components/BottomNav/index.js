import {ActionTypes, Screens} from "../../globals/constants";
import React from "react";
import connect from "react-redux/es/connect/connect";
import './BottomNav.scss';

const bottomNav = (props) => {
    const messagesScreenActive = props.screen === Screens.MESSAGES ? "bottom-nav__item--active": "";
    const settingsScreenActive = props.screen === Screens.SETTINGS ? "bottom-nav__item--active": "";
    return (
        <div className="bottom-nav">
            <div className={`bottom-nav__item ${messagesScreenActive}`} onClick={() => props.changeScreen(Screens.MESSAGES)}>
                <i className="fas fa-comment"/>
            </div>
            <div className="bottom-nav__item" onClick={() => {
                props.changeActiveChat(props.chats.stationChat);
                props.changeReceiver(props.chats.stationChat.receiver);
                props.changeScreen(Screens.CHAT);
            }}>
                <i className="fas fa-users"/>
            </div>
            <div className={`bottom-nav__item ${settingsScreenActive}`} onClick={() => props.changeScreen(Screens.SETTINGS)}>
                <i className="fas fa-cog"/>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        chats: state.chats,
        screen: state.screen,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(bottomNav);
