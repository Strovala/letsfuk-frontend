import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core";
import {API, tryNewStation} from "../../../../globals/methods";
import {ActionTypes, Constants} from "../../../../globals/constants";
import {connect} from "react-redux";
import Loading from "../../../Loading/Loading";
import ChatPreview from "./ChatPreview/ChatPreview";
import LogoutButton from "../../../Buttons/LogoutButton";
import Grid from "@material-ui/core/Grid/Grid";
import humps from "humps";
import EnableNotificationsButton
    from "../../../Buttons/EnableNotificationsButton";

const styles = (theme) => ({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    heading: {
        fontSize: "1.25rem",
        fontWeight: "bold",
        marginTop: "1vh",
        marginBottom: "1vh",
    },
    chatList: {
        flex: 8,
        overflow: "auto",
        overflowX: "hidden"
    },
});

class ChatListLayout extends Component {
    state = {
        limit: Constants.CHATS_LIMIT,
        loadedAll: false
    };

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
        this._ismounted = true;
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

    render() {
        if (!this.props.chats)
            return <Loading />;
        return (
            <Grid container direction="column" className={this.props.classes.root}>
                <Typography variant="h3" className={this.props.classes.heading}>Chats</Typography>
                <Grid
                    onScroll={() => this.scrollHandler()}
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
                    {this.props.chats.privateChats.map((privateChat, index) => {
                        // Plus one because of station chat
                        const chatsLength = this.props.chats.privateChats.length + 1;
                        const shouldBeTrigger = chatsLength - 1 - Constants.TRIGGER_CHAT_INDEXES_COUNT <= index <= chatsLength - 1;
                        return (
                            <ChatPreview
                                setTrigger={(ref) => shouldBeTrigger ? this.setTrigger(ref): null}
                                key={privateChat.receiver.id}
                                chat={privateChat}
                            />
                        );
                    })}
                </Grid>
                <EnableNotificationsButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={this.props.classes.submit}
                />
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
