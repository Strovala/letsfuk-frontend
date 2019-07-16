import React, {Component} from 'react';
import {styles} from "../../MainLayout";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {API} from "../../../../globals/methods";
import {ActionTypes, Constants, cookies} from "../../../../globals/constants";
import Loading from "../../../Loading/Loading";
import ScrollMessages from "../../../Chat/ScrollMessages";
import Messages from "../../../Chat/Messages";
import TextInput from "../../../Inputs/TextInput";
import SendMessageButton from "../../../Chat/SendMessageButton";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";


class ChatLayout extends Component {
    state = {
        text: "",
        limit: Constants.LIMIT
    };

    getMessagesFromBackend() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        API.getMessages({
            sessionId: sessionId,
            receiverId: this.props.receiver.id,
            limit: this.state.limit,
            response: response => {
                let messages = response.data.messages;
                this.props.changeActiveChat({
                    ...this.props.chat,
                    messages: messages
                });
            }
        });
    }

    resetUnreadMessages(stationId, senderId) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        let data = {
            station_id: stationId,
            sender_id: senderId,
            count: 0,
        };
        API.resetUnreadMessages({
            sessionId: sessionId,
            data: data
        });
    }

    getMessages() {
        this.getMessagesFromBackend();

        if (this.props.receiver.isStation)
            this.resetUnreadMessages(this.props.receiver.id, undefined);
        else {
            this.resetUnreadMessages(undefined, this.props.receiver.id);
        }
    }

    componentDidMount() {
        this._ismounted = true;
        this.getMessages();
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getMessages();
        });
    }

    componentWillUnmount() {
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

    handleLimit(value) {
        this.setState({
            limit: value
        })
    }

    render() {
        if (!this.props.chat)
            return <Loading />;
        return (
            <div>
                <ScrollMessages limit={this.state.limit} changeLimit={(value) => this.handleLimit(value)}/>
                <Messages />
                <TextField
                    id="standard-multiline-flexible"
                    label="Multiline"
                    multiline
                    rowsMax="4"
                    className={this.props.classes.textField}
                    margin="normal"
                    inputProps={{
                        value: this.state.text,
                        onChange: (event) => this.handleText(event)
                    }}
                />
                <SendMessageButton text={this.state.text} clearText={() => this.clearText()}/>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        chat: state.activeChat,
        receiver: state.receiver,
        limit: state.limit,
        webSocket: state.webSocket,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeReceiver: (value) => dispatch({type: ActionTypes.RECEIVER_CHANGE, value: value}),
        changeActiveChat: (value) => dispatch({type: ActionTypes.ACTIVE_CHAT_CHANGE, value: value})
    }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatLayout));
