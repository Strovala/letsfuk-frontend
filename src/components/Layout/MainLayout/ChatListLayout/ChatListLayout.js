import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {styles} from "../index";
import {withStyles} from "@material-ui/core";
import {API} from "../../../../globals/methods";
import {ActionTypes} from "../../../../globals/constants";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import StationChat from "./StationChat";
import PrivateChats from "./PrivateChats";
import Loading from "../../../Loading/Loading";


class ChatListLayout extends Component {

    componentDidMount() {
        API.getChats({
            user: this.props.user,
            response: response => {
                this.props.setChats(response.data);
                this.props.changeActiveStation(response.data.stationChat.receiver);
            }
        });
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
                    <StationChat />
                    <PrivateChats />
                </Grid>
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
