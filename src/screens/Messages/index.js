import React, {Component} from 'react';
import {connect} from "react-redux";
import humps from "humps";
import {ActionTypes, Constants, Screens} from "../../globals/constants";
import {API, tryNewStation} from "../../globals/methods";
import Popup from "../../components/Popup";
import Spinner from "../../components/Spinner";
import ChatPreview from './ChatPreview';
import Aux from "../../components/hoc/Aux";
import BottomNav from "../../components/BottomNav";
import '../../sass/layout.scss';

class ChatListLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            limit: Constants.CHATS_LIMIT,
            loadedAll: false
        };
    }

    scrollToTop() {
        this.pageTop.scrollIntoView();
    }

    loadMoreChats() {
        const newLimit = this.state.limit + Constants.CHATS_LIMIT;
        API.getChats({
            user: this.props.user,
            limit: newLimit,
            response: response => {
                if (!this._ismounted) return;
                let chats = response.data;
                const totalString = response.headers[Constants.X_TOTAL_HEADER];
                const total = parseInt(totalString);
                // Plus one because of station chat
                if (chats.privateChats.length + 1 === total) {
                    this.setState({
                        loadedAll: true
                    });
                }
                this.props.setChats(chats);
                this.props.changeActiveStation(response.data.stationChat.receiver);
                this.setState({
                    limit: newLimit
                });
            }
        });
    }

    getChats() {
        API.getChats({
            user: this.props.user,
            limit: this.state.limit,
            response: response => {
                this.props.setChats(response.data);
                this.props.changeActiveStation(response.data.stationChat.receiver);
            }
        });
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        this._ismounted = true;
        this.scrollToTop();
        this.getChats();
        this.props.webSocket.bind('message', (data) => {
            if (!this._ismounted)
                return;
            data = humps.camelizeKeys(data);
            this.getChats();
        });
        if (this.props.user)
            tryNewStation({
                user: this.props.user,
            })
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
        this._ismounted = false;
    }

    scrollHandler() {
        const isIn = this.isTriggererInViewport();
        if (isIn) {
            this.triggers = [];
            this.loadMoreChats();
        }
    }

    isTriggererInViewport(offset = 0) {
        if (this.state.loadedAll) return false;
        if (this.triggers.length === 0) return false;
        return this.triggers.some((trigger) => {
            const top = trigger.getBoundingClientRect().top;
            return (top + offset) >= 0 && (top - offset) <= window.innerHeight
        });
    }

    setTrigger(value) {
        if (!value)
            return;
        if (!this.triggers)
            this.triggers = [];
        this.triggers.push(value);
    }

    handleScroll() {
        if (this.state.loadedAll)
            return;
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            this.loadMoreChats();
            if (this.lastChat)
                this.lastChat.scrollIntoView({ behavior: "smooth" });
        }
    }

    render() {
        let messages = null;
        let popup = null;
        if (this.props.chats) {
            messages = (
                <Aux>
                    <ChatPreview
                        iconClassName="fas fa-users"
                        key={this.props.chats.stationChat.receiver.id}
                        chat={this.props.chats.stationChat}
                    />
                    {this.props.chats.privateChats.map((privateChat, index) => (
                        <ChatPreview
                            setRef={index === this.props.chats.privateChats.length-1 ? (value) => (this.lastChat = value): ()=>{}}
                            key={privateChat.receiver.id}
                            iconClassName="fas fa-user"
                            chat={privateChat}
                        />
                    ))}
                </Aux>
            )
        } else {
            popup = (
                <Popup className="popup--active">
                    <Spinner/>
                </Popup>
            );
        }
        return (
            <div className="layout">
                {popup}
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { this.pageTop = el; }}>
                </div>
                <div className="layout__header">
                    <h3 className="layout-heading">Messages</h3>
                    <button className="open-chat-button" onClick={() => this.props.changeScreen(Screens.NEW_MESSAGE)}><i className="fas fa-edit"/></button>
                </div>
                <div className="layout__content">
                    {messages}
                </div>
                <div className="layout__footer">
                    <BottomNav />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        chats: state.chats,
        screen: state.screen,
        user: state.user,
        webSocket: state.webSocket
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setChats: (value) => dispatch({type: ActionTypes.CHATS_CHANGE, value: value}),
        changeActiveStation: (value) => dispatch({type: ActionTypes.ACTIVE_STAION_CHANGE, value: value}),
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatListLayout);
