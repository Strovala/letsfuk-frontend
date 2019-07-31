import React, {useState} from 'react';
import {
    ActionTypes,
} from "../../globals/constants";
import {connect} from "react-redux";
import Button from "@material-ui/core/Button/Button";
import {configurePushSub} from "../../globals/methods";

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
                            configurePushSub(props.user);
                            setVisible(false);
                        }
                    })
            }}>Enable Notifications</Button>
    );
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(enableNotificationsButton);