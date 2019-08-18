import React, {Component} from 'react';
import {connect} from "react-redux";
import {ActionTypes, Screens} from "../../globals/constants";
import '../../sass/layout.scss';
import '../NewMessage/NewMessage.scss';
import Avatar from "../../components/Avatar";

class MembersPreview extends Component {

    scrollToTop() {
        if (this.pageTop)
            this.pageTop.scrollIntoView();
    }

    componentDidMount() {
        this.scrollToTop()
    }

    render() {
        let users = null;
        if (this.props.members) {
            users = (
                <div className="users">
                    {this.props.members.map((user) => {
                        return <div className="users__user" key={user.userId} onClick={(event)=> {
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
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { this.pageTop = el; }}>
                </div>
                <div className="layout__header">
                    <div className="layout__back" onClick={() => this.props.changeScreen(Screens.CHAT)}>
                        <i className="fas fa-arrow-left"/>
                    </div>
                    <h3 className="layout-heading">Members</h3>
                </div>
                <div className="layout__content">
                    {users}
                </div>
            </div>

        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
        members: state.members,
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


export default connect(mapStateToProps, mapDispatchToProps)(MembersPreview);
