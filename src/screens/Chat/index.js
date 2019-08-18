import React, {Component} from 'react';
import {connect} from "react-redux";
import humps from "humps";
import {ActionTypes, Constants, Screens} from "../../globals/constants";
import {API, mobileCheck} from "../../globals/methods";
import MessagePreview from './MessagePreview';
import Textarea from 'react-textarea-autosize';
import ImagePreview from '../../components/ImagePreview';
import './Chat.scss';
import '../../sass/layout.scss';
import Avatar from "../../components/Avatar";
import Popup from "../../components/Popup";
import Spinner from "../../components/Spinner";

class ChatLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            text: "",
            imageKey: "",
            limit: Constants.MESSAGES_LIMIT,
            loadedAll: false,
            imageSource: null,
            sendingPreview: null
        }
    }

    scrollToLastMessage() {
        if (this.messagesEnd)
            this.messagesEnd.scrollIntoView();
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
                this.enableScrolling();
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
        this.scrollToLastMessage();
        this.getMessages();
        this.props.webSocket.bind('message', (data) => {
            if (!this._ismounted)
                return;
            data = humps.camelizeKeys(data);
            // If one who sent message is receiver in this private chat
            // Station will never be sender
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
        if (window.pageYOffset === 0) {
            // this.loadMoreMessages() will enable scrolling after
            // loading more messages
            this.loadMoreMessages();
            if (this.topMessage)
                this.topMessage.scrollIntoView({ behavior: "smooth" });
            this.disableScrolling();
        }
    }

    sendImage() {
        const buf = new Buffer(this.state.imageSource.replace(/^data:image\/\w+;base64,/, ""),'base64');
        API.uploadPhoto({
            user: this.props.user,
            data: buf
        })
            .then(key => {
                this.sendMessageToApi({
                    image_key: key
                });
                this.closeImagePreview();
            })
    }

    sendMessage() {
        let processedText = this.state.text.trim();
        if (!processedText)
            return;
        let data = {
            "text": processedText
        };
        this.sendMessageToApi(data)
    }

    sendMessageToApi(data) {
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

    handleImageClick(imgUrl) {
        this.setState({
            imageSource: imgUrl
        })
    }

    pickImageHandler(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fr = new FileReader();
            fr.onload = () => {
                this.setState({
                    imageSource: fr.result,
                    sendingPreview: true
                })
            };
            fr.readAsDataURL(file);
        }
    }

    closeImagePreview() {
        this.setState({
            imageSource: null,
            sendingPreview: null
        });
        this.enableScrolling();
        // Enable picking same image multiple times in a row
        this.imageInput.value = "";
    }

    disableScrolling() {
        document.body.style.overflow = "hidden";
    }

    enableScrolling() {
        document.body.style.overflow = "auto";
    }

    render() {
        let imagePreview = null;
        if (this.state.imageSource) {
            let imagePreviewProps = {
                onClose: () => this.closeImagePreview(),
                imageSource: this.state.imageSource,
            };
            if (this.state.sendingPreview) {
                imagePreviewProps.onSend = () => this.sendImage();
            }
            imagePreview = <ImagePreview {...imagePreviewProps}/>;
            this.disableScrolling();
        }
        let chat = null;
        let popup = null;
        if (this.props.chat) {
            chat = (
                <div className="chat">
                    {this.props.chat.messages.map((message, index) => (
                        <MessagePreview
                            setRef={index === 0 ? (value) => (this.topMessage = value) : () => {
                            }}
                            key={message.messageId}
                            message={message}
                            prevMessage={index !== 0 ? this.props.chat.messages[index - 1] : null}
                            receiver={this.props.chat.receiver}
                            imageClick={(imgUrl) => this.handleImageClick(imgUrl)}
                        />
                    ))}
                    {/* For scrolling to last message */}
                    <div style={{float: "left", clear: "both"}}
                         ref={(el) => {
                             this.messagesEnd = el;
                         }}>
                    </div>
                </div>
            );
        } else {
            popup = (
                <Popup className="popup--active">
                    <Spinner/>
                </Popup>
            );
        }
        let chatHeading = null;
        if (!this.props.receiver.isStation) {
            chatHeading = (
                <div className="chat-heading">
                    <Avatar className="chat-heading__avatar" iconClassName="fas fa-user" avatarKey={this.props.receiver.avatarKey} />
                    <h3 className="chat-heading__text">{this.props.receiver.username}</h3>
                </div>
            );
        } else {
            chatHeading = (
                <div className="chat-heading">
                    <Avatar className="chat-heading__avatar" iconClassName="fas fa-users" avatarKey={this.props.receiver.avatarKey} />
                    <h3 className="chat-heading__text" onClick={() => {
                        this.props.changeMembers(this.props.receiver.members);
                        this.props.changeScreen(Screens.MEMBERS_PREVIEW)
                    }}>{`${this.props.receiver.members.length} members`}</h3>
                </div>
            );
        }
        return (
            <div className="layout">
                {popup}
                {imagePreview}
                <div className="layout__header">
                    <div className="layout__back" onClick={() => this.props.changeScreen(Screens.MESSAGES)}>
                        <i className="fas fa-arrow-left"/>
                    </div>
                    {chatHeading}
                </div>
                <div className="layout__content u-column-flex-end" ref={(el) => this.layoutContent = el}>
                    {chat}
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
                                // Default padding for layout__content is 5.4rem for this current footer
                                // As footer grows as textarea grops we need to increase padding for layout__content
                                // Default height is 29px for this textarea and that is data
                                // Divide by 10 to turn it into rem and add (5.4-2.9)
                                // Hacky but it works :/
                                const newPadding = data/10 + (5.4-2.9);
                                this.layoutContent.style.paddingBottom = `${newPadding}rem`;
                                // Also it would be great if i could scroll to bottom, but it wont work :/
                                // this.scrollToLastMessage();
                            }}
                        />
                        <div className="send-message__button">
                            <input type="file" id="imageUpload" accept="image/*" ref={(el) => this.imageInput = el} onChange={(event) => this.pickImageHandler(event)}/>
                            <label htmlFor="imageUpload"><i className="fas fa-image"/></label>
                        </div>
                        <button className="send-message__button" onClick={() => this.sendMessage()}><i className="fas fa-paper-plane"/></button>
                    </div>
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
        changeActiveStation: (value) => dispatch({type: ActionTypes.ACTIVE_STAION_CHANGE, value: value}),
        changeMembers: (value) => dispatch({type: ActionTypes.MEMBERS_CHANGE, value: value})
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ChatLayout);
