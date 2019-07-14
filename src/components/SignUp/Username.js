import React from 'react';
import connect from "react-redux/es/connect/connect";
import {ActionTypes} from "../../globals/constants";

const username = (props) => (
    <label>
        Username:
        <input type="text" value={this.props.username} onChange={(event) => this.props.changeUsername(event.target.value)} />
    </label>
);

const mapStateToProps = state => {
    return {
        username: state.username
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeUsername: (username) => dispatch({type: ActionTypes.USERNAME_CHANGE, username: username}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(username);
