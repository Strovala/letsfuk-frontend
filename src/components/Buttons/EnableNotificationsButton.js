import React, {useState} from 'react';
import Button from "@material-ui/core/Button/Button";
import {
    configurePushSub,
    getPushNotificationUserSub
} from "../../globals/methods";
import {connect} from "react-redux";

const enableNotificationsButton = props => {
    const [disabled, setDisabled] = useState(false);

    if (!('Notification' in window))
        return null;
    getPushNotificationUserSub()
        .then(sub => {
            console.log("Registered sub", sub);
            setDisabled(sub !== null);
        });
    return (
        <Button
            type={props.type}
            fullWidth={props.fullWidth}
            variant={props.variant}
            color={props.color}
            className={props.className}
            disabled={disabled}
            onClick={() => {
                Notification.requestPermission()
                    .then(result => {
                        if (result === 'granted') {
                            configurePushSub({
                                user: props.user,
                                response: () => setDisabled(true)
                            })
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