import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core";
import {API} from "../../../../globals/methods";
import {ActionTypes} from "../../../../globals/constants";
import {connect} from "react-redux";
import Loading from "../../../Loading/Loading";
import ChatPreview from "./ChatPreview/ChatPreview";
import LogoutButton from "../../../Buttons/LogoutButton";
import Grid from "@material-ui/core/Grid/Grid";

const styles = (theme) => ({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    heading: {
        margin: theme.spacing(2)
    },
    chatList: {
        flex: 8,
        overflow: "auto"
    },
});

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
            <Grid container direction="column" className={this.props.classes.root}>
                <Typography variant="h3" className={this.props.classes.heading}>Chats</Typography>
                <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    wrap="nowrap"
                    className={this.props.classes.chatList}
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
            </Grid>
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
