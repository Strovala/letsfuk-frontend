import React, {Component} from 'react';
import StationChat from './StationChat'
import Aux from './../../hoc/Aux';
import {ActionTypes} from "../../globals/constants";
import {API} from "../../globals/methods";
import PrivateChats from "./PrivateChats";
import {connect} from "react-redux";
import Loading from "../Loading/Loading";

class ChatList extends Component {

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
        setChats: (value) => dispatch({type: ActionTypes.CHATS_CHANGE, value: value}),
        changeActiveStation: (value) => dispatch({type: ActionTypes.ACTIVE_STAION_CHANGE, value: value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
