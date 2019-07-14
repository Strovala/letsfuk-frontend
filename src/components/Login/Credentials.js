import React from 'react';
import connect from "react-redux/es/connect/connect";
import {ActionTypes} from "../../globals/constants";

const credentials = (props) => (
    <label>
        Username/email:
        <input type="text" value={props.credentials} onChange={(event) => props.changeCredentials(event.target.value)} />
    </label>
);

const mapStateToProps = state => {
    return {
        credentials: state.credentials
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeCredentials: (credentials) => dispatch({type: ActionTypes.CREDENTIALS_CHANGE, credentials: credentials}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(credentials);