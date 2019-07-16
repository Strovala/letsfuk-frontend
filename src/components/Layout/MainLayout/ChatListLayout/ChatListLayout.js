import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {styles} from "../index";
import {withStyles} from "@material-ui/core";
import {API} from "../../../../globals/methods";
import {ActionTypes} from "../../../../globals/constants";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Loading from "../../../Loading/Loading";
import ChatPreview from "./ChatPreview/ChatPreview";
import LogoutButton from "../../../Buttons/LogoutButton";


class ChatListLayout extends Component {

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
        if (!this.props.chats)
            return <Loading />;
        return (
            <div className={this.props.classes.paper}>
                <Typography variant="h3" className={this.props.classes.heading}>Chats</Typography>
                <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                >
                    <ChatPreview
                        key={this.props.chats.stationChat.receiver.id}
                        chat={this.props.chats.stationChat}
                    />
                    {this.props.chats.privateChats.map((privateChat) => {
                        return (
                            <ChatPreview
                                key={privateChat.receiver.id}
                                chat={privateChat}
                            />
                        );
                    })}
                </Grid>
                <LogoutButton />
            </div>
        );
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
        changeActiveStation: (value) => dispatch({type: ActionTypes.ACTIVE_STAION_CHANGE, value: value}),
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatListLayout));
