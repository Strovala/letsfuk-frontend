import React from 'react';
import {connect} from "react-redux";
import {ActionTypes} from "../../globals/constants";

const email = (props) => (
    <div>
        <label>
            Email:
            <input type="text" value={props.email} onChange={(event) => props.changeEmail(event.target.value)} />
        </label>
    </div>
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
