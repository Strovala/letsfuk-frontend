import React from 'react';
import connect from "react-redux/es/connect/connect";
import {ActionTypes} from "../../globals/constants";

const password = (props) => (
    <label>
        Password:
        <input type="password" value={props.password} onChange={(event) => props.changePassword(event.target.value)} />
    </label>
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