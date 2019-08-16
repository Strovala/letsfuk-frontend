import React, {Component} from 'react';
import {connect} from "react-redux";
import {ActionTypes, Screens} from "../../globals/constants";
import '../../sass/layout.scss';
import './NewMessage.scss';
import {API} from "../../globals/methods";
import IconPlaceholderInput from "../Login/IconPlaceholderInput";
import Avatar from "../../components/Avatar";

class ChatLayout extends Component {
    state = {
        username: "",
        users: null
    };

    handleUsers(event) {
        const search = event.target.value;
        this.setState({
            username: search
        });
        if (search === "") {
            this.setState({
                users: null
            });
            return;
        }
        // Call Backend to query users by username
        API.queryByUsername({
            user: this.props.user,
            username: search
        })
            .then(response => {
                const users = response.data.users;
                this.setState({
                    users: users
                })
            })
    }

    render() {
        let users = null;
        if (this.state.users) {
            users = (
                <div className="users">
                    {this.state.users.map((user) => {
                        return <div className="users__user" onClick={(event)=> {
                            const receiver = user;
                            receiver.id = receiver.userId;
                            this.props.changeReceiver(receiver);
                            this.props.changeScreen(Screens.CHAT);
                        }}>
                            <Avatar className="users__user-avatar" iconClassName="fas fa-user" avatarKey={user.avatarKey} />
                            <div className="users__user-username">{user.username}</div>
                        </div>
                    })}
                </div>
            );
        }
        return (
            <div className="layout">
                <div className="layout__header">
                    <div className="users__search">
                        <IconPlaceholderInput
                            spanClassName="users__input-icon"
                            iconClassName="fas fa-search"
                            inputProps={{
                                type: "text",
                                placeholder: "Search",
                                className: "users__input",
                                onChange: (event) => this.handleUsers(event)
                            }}
                        />
                        <button className="cancel-button" onClick={() => this.props.changeScreen(Screens.MESSAGES)}>Cancel</button>
                    </div>
                </div>
                <div className="layout__content" ref={(el) => this.layoutContent = el}>
                    {users}
                </div>
            </div>

        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
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
