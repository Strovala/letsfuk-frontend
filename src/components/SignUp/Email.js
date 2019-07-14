import React from 'react';
import connect from "react-redux/es/connect/connect";
import {ActionTypes} from "../../globals/constants";

const email = (props) => (
    <label>
        Username:
        <input type="text" value={props.email} onChange={(event) => props.changeEmail(event.target.value)} />
    </label>
);

const mapStateToProps = state => {
    return {
        email: state.email
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeEmail: (email) => dispatch({type: ActionTypes.EMAIL_CHANGE, email: email}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(email);
