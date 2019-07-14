import React from 'react';
import {connect} from "react-redux";
import {ActionTypes} from "../../globals/constants";

const credentials = (props) => (
    <div>
        <label>
            Username/email:
            <input type="text" value={props.credentials} onChange={(event) => props.changeCredentials(event.target.value)} />
        </label>
    </div>
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