import React from "react";
import {ActionTypes} from "../../globals/constants";
import connect from "react-redux/es/connect/connect";

const messageText = (props) => (
    <input type="text" value={props.text} onChange={(event) => props.changeText(event.target.value)} />
);

const mapStateToProps = state => {
    return {
        text: state.text,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeText: (text) => dispatch({type: ActionTypes.TEXT_CHANGE, text: text}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(messageText);