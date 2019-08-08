import React, {Component} from 'react';
import {connect} from "react-redux";
import humps from "humps";
import {ActionTypes, Constants, Screens} from "../../globals/constants";
import {API, mobileCheck} from "../../globals/methods";
import MessagePreview from './MessagePreview';
import Textarea from 'react-textarea-autosize';
import './Chat.scss';
import '../../sass/layout.scss';

class ChatLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            text: "",
            limit: Constants.MESSAGES_LIMIT,
            loadedAll: false
        }
    }

    scrollToLastMessage() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    loadMoreMessages() {
        const newLimit = this.state.limit + Constants.MESSAGES_LIMIT;
        API.getMessages({
            user: this.props.user,
            receiverId: this.props.receiver.id,
            limit: newLimit,
            response: response => {
                if (!this._ismounted) return;
                let messages = response.data.messages;
                const totalString = response.headers[Constants.X_TOTAL_HEADER];
                const total = parseInt(totalString);
                if (messages.length === total) {
                    this.setState({
                        loadedAll: true
                    });
                }
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
                this.setState({
                    limit: newLimit
                });
            }
        });
    }

    getMessagesFromBackend(limit) {
        limit = limit || this.state.limit;
        API.getMessages({
            user: this.props.user,
            receiverId: this.props.receiver.id,
            limit: limit,
            response: response => {
                if (!this._ismounted) return;
                this.setState({
                    limit: limit
                });
                let messages = response.data.messages;
                this.props.changeActiveChat({
                    ...this.props.chat,
                    receiver: this.props.receiver,
                    messages: messages
                });
                this.scrollToLastMessage();
            }
        });
    }

    resetUnreadMessages(stationId, senderId) {
        let data = {
            station_id: stationId,
            sender_id: senderId,
            count: 0,
        };
        API.resetUnreadMessages({
            user: this.props.user,
            data: data,
            response: () => {
                this.getChats()
            }
        });
    }

    resetUnreads() {
        if (this.props.receiver.isStation)
            this.resetUnreadMessages(this.props.receiver.id, undefined);
        else {
            this.resetUnreadMessages(undefined, this.props.receiver.id);
        }
    }

    getMessages() {
        this.getMessagesFromBackend();
        this.resetUnreads();
    }

    getChats() {
        API.getChats({
            user: this.props.user,
            response: response => {
                this.props.setChats(response.data);
                this.props.changeActiveStation(response.data.stationChat.receiver);
            }
        });
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        this._ismounted = true;
        this.getMessages();
        this.props.webSocket.bind('message', (data) => {
            if (!this._ismounted)
                return;
            data = humps.camelizeKeys(data);
            // If one who sent message is receiver in this private chat
            // Station will never be sender
            console.log(data);
            if (this.props.receiver.isStation || data.sender.userId === this.props.receiver.id) {
                // Just update sent message to chats
                let messages = this.props.chat.messages;
                messages.push(data);
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
                this.resetUnreads();
                this.scrollToLastMessage();
            } else {
                this.getChats();
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
        this._ismounted = false;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.receiver.id !== this.props.receiver.id)
            this.getMessages();
    }

    handleText(event) {
        this.setState({
            text: event.target.value
        })
    }

    clearText() {
        this.setState({
            text: ""
        })
    }

    scrollHandler() {
        const isIn = this.isTriggererInViewport();
        if (isIn) {
            this.triggers = [];
            this.loadMoreMessages();
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
        if (window.pageYOffset === 0) {
            this.loadMoreMessages();
            this.topMessage.scrollIntoView({ behavior: "smooth" });
        }
        if (windowBottom >= docHeight) {
            console.log('bottom reached');
        }
    }

    sendMessage() {
        let processedText = this.state.text.trim();
        if (!processedText)
            return;
        let data = {
            "text": processedText
        };
        if (!this.props.receiver.isStation) {
            data['user_id'] = this.props.receiver.userId;
        }
        API.sendMessage({
            user: this.props.user,
            data: data,
            response: (response) => {
                let messages = this.props.chat.messages;
                messages.push(response.data);
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
                this.getChats();
                this.scrollToLastMessage();
            }
        });
        this.sendMessageArea.focus();
        this.setState({
            text: ""
        });
    }

    render() {
        return (
            <div className="layout">
                <div className="layout__header">
                    <div className="layout__back" onClick={() => this.props.changeScreen(Screens.MESSAGES)}>
                        <i className="fas fa-arrow-left"/>
                    </div>
                    <h3 className="layout-heading">{this.props.receiver.username}</h3>
                </div>
                <div className="layout__content" ref={(el) => this.layoutContent = el}>
                    <div className="chat">
                        {this.props.chat.messages.map((message, index) => (
                            <MessagePreview
                                setRef={index === 0 ? (value) => (this.topMessage = value): ()=>{}}
                                key={message.messageId}
                                message={message}
                                prevMessage={index !== 0 ? this.props.chat.messages[index-1]: null}
                                receiver={this.props.chat.receiver}
                            />
                        ))}
                    </div>
                </div>
                <div className="layout__footer">
                    <div className="send-message">
                        <Textarea
                            className="send-message__area"
                            placeholder="Type a message"
                            inputRef={(el) => this.sendMessageArea = el}
                            value={this.state.text}
                            onChange={(event) => {
                                this.handleText(event);
                            }}
                            onKeyPress={(event) => {
                                const isMobile = mobileCheck();
                                if (isMobile)
                                    return;
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    this.sendMessage();
                                    if(event.preventDefault) event.preventDefault();
                                    return false;
                                }
                            }}
                            minRows={1}
                            maxRows={4}
                            onHeightChange={(data) => {
                                // Default padding for layout__content is 5.7rem for this current footer
                                // As footer grows as textarea grops we need to increase padding for layout__content
                                // Default height is 29px for this textarea and that is data
                                // Divide by 10 to turn it into rem and add (5.7-2.9)
                                // Hacky but it works :/
                                const newPadding = data/10 + 2.8;
                                this.layoutContent.style.paddingBottom = `${newPadding}rem`;
                                // Also it would be great if i could scroll to bottom, but it wont work :/
                                // this.scrollToLastMessage();
                            }}
                        />
                        <button className="send-message__button" onClick={() => this.sendMessage()}><i className="fas fa-paper-plane"/></button>
                    </div>
                </div>
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>

        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
        chat: state.activeChat,
        receiver: state.receiver,
        webSocket: state.webSocket,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value}),
        setChats: (value) => dispatch({type: ActionTypes.CHATS_CHANGE, value: value}),
        changeActiveStation: (value) => dispatch({type: ActionTypes.ACTIVE_STAION_CHANGE, value: value})
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ChatLayout);
