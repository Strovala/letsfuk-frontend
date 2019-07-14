import React from 'react';
import {connect} from "react-redux";
import {ActionTypes} from "../../globals/constants";

const username = (props) => (
    <div>
        <label>
            Username:
            <input type="text" value={props.username} onChange={(event) => props.changeUsername(event.target.value)} />
        </label>
    </div>
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
