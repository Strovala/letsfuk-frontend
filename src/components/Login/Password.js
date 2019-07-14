import React from 'react';
import {connect} from "react-redux";
import {ActionTypes} from "../../globals/constants";

const password = (props) => (
    <div>
        <label>
            Password:
            <input type="password" value={props.password} onChange={(event) => props.changePassword(event.target.value)} />
        </label>
    </div>
);

const mapStateToProps = state => {
    return {
        password: state.password
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePassword: (password) => dispatch({type: ActionTypes.PASSWORD_CHANGE, password: password}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(password);