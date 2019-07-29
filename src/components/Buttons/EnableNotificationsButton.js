import React, {useState} from 'react';
import {
    ActionTypes,
} from "../../globals/constants";
import {connect} from "react-redux";
import Button from "@material-ui/core/Button/Button";

const enableNotificationsButton = props => {
    const [visible, setVisible] = useState(true);

    if (!visible || !('Notification' in window))
        return null;
    return (
        <Button
            type={props.type}
            fullWidth={props.fullWidth}
            variant={props.variant}
            color={props.color}
            className={props.className}
            onClick={() => {
                Notification.requestPermission()
                    .then(result => {
                        if (result === 'granted') {
                            setVisible(false);
                        }
                    })
            }}>Enable Notifications</Button>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeWebSocket: (value) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default connect(null, mapDispatchToProps)(enableNotificationsButton);