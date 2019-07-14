import React, {Component} from 'react';
import StationChat from './StationChat'
import Aux from './../../hoc/Aux';
import {ActionTypes, cookies} from "../../globals/constants";
import {API} from "../../globals/methods";
import PrivateChats from "./PrivateChats";
import connect from "react-redux/es/connect/connect";
import Loading from "../Loading/Loading";

class ChatList extends Component {

    getChats() {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = this.props.user.sessionId;
        }
        API.getChats({
            sessionId: sessionId,
            response: response => this.props.setChats(response.data)
        });
    }

    componentDidMount() {
        this._ismounted = true;
        this.getChats();
        let that = this;
        this.props.webSocket.bind('message', function (data) {
            if (!that._ismounted)
                return;
            that.getChats();
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        if (this.props.chats) {
            return (
                <Aux>
                    <StationChat />
                    <PrivateChats />
                </Aux>
            );
        }
        return <Loading />

    }
}
const mapStateToProps = state => {
    return {
        chats: state.chats,
        user: state.user,
        webSocket: state.webSocket
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setChats: (chats) => dispatch({type: ActionTypes.CHATS_CHANGE, chats: chats})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
