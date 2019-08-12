import React, {Component} from "react";
import BottomNav from "../../components/BottomNav";
import Toogle from "../../components/Toogle";
import './Settings.scss';
import {
    API, clearCaches,
    configurePushSub,
    getPushNotificationUserSub
} from "../../globals/methods";
import connect from "react-redux/es/connect/connect";
import {ActionTypes, cookies, Screens} from "../../globals/constants";
import Resizer from "react-image-file-resizer";

class Settings extends Component {
    state = {
        previewStyle: null
    };

    componentDidMount() {
        API.whoAmI({
            response: response => {
                API.getPhotoUrl({
                    user: this.props.user,
                    data: {
                        key: response.data.user.avatarKey
                    }
                })
                    .then(response => {
                        this.setState({
                            previewStyle: {
                                backgroundImage: `url(${response.data.url})`
                            }
                        })
                    })
            }
        });
        getPushNotificationUserSub(this.props.user)
            .then(sub => {
                if (sub)
                    this.props.changeNotificationsEnabled(true);
                else
                    this.props.changeNotificationsEnabled(false);
            });
    }

    handleNotificationsEnable(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            if (!('Notification' in window)) {
                this.props.changeNotificationsEnabled(false);
                return;
            }
            Notification.requestPermission()
                .then(result => {
                    if (result === 'granted') {
                        configurePushSub({user: this.props.user})
                            .then(sub => {
                                this.props.changeNotificationsEnabled(sub !== null);
                            })
                    }
                })
        } else {
            getPushNotificationUserSub(this.props.user)
                .then(sub => {
                    if (sub) {
                        API.unsubscribePushNotification({
                            user: this.props.user,
                            data: sub.toJSON(),
                            response: () => {
                                this.props.changeNotificationsEnabled(false);
                            }
                        })
                    }
                });
        }
    }

    pickImageHandler(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            Resizer.imageFileResizer(
                file,
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    this.setState({
                        previewStyle: {
                            backgroundImage: `url(${uri})`
                        }
                    });
                    const buf = new Buffer(uri.replace(/^data:image\/\w+;base64,/, ""),'base64');
                    API.uploadPhoto({
                        user: this.props.user,
                        data: buf
                    })
                        .then(key => {
                            API.updateAvatar({
                                user: this.props.user,
                                key: key
                            })
                        })
                },
                "base64"
            );
        }
    }

    handleLogoutClick(event) {
        const logout = () => {
            API.logout({
                user: this.props.user,
                response: () => {
                    cookies.remove('user-id');
                    cookies.remove('session-id');
                    clearCaches();
                    this.props.changeAuthenticated(false);
                    this.props.changeScreen(Screens.LOGIN);
                    // changing user needs to go after changing screen
                    // because Chat screen uses user
                    this.props.changeUser(null);
                    this.props.changeWebSocket(null);
                }
            })
        };
        getPushNotificationUserSub(this.props.user)
            .then(sub => {
                if (sub) {
                    API.unsubscribePushNotification({
                        user: this.props.user,
                        data: sub.toJSON(),
                        response: logout,
                        error: logout
                    })
                } else {
                    logout()
                }
            });
    }

    render() {
        return (
            <div className="layout">
                <div className="layout__header">
                    <h3 className="layout-heading">Settings</h3>
                </div>
                <div className="layout__content">
                    <div className="settings">
                        <div className="settings__item">
                            <h2 className="settings__item-heading">User
                                profile</h2>
                            <div className="settings__item-content">
                                <h3 className="settings__username">
                                    {this.props.user.user.username}
                                </h3>
                                <div className="settings__avatar">
                                    <div className="settings__avatar-edit">
                                        <input type="file" id="imageUpload" accept="image/*" onChange={(event) => this.pickImageHandler(event)}/>
                                        <label htmlFor="imageUpload"/>
                                    </div>
                                    <div className="settings__avatar-preview" style={this.state.previewStyle}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="settings__item">
                            <h2 className="settings__item-heading">App settings</h2>
                            <div className="settings__item-content">
                                <div className="settings__toogle">
                                    <p className="settings__toogle-label">Enable
                                        Notifications</p>
                                    <Toogle checked={this.props.notificationsEnabled} onChange={(event) => this.handleNotificationsEnable(event)}/>
                                </div>
                            </div>
                        </div>
                        <div className="settings__item">
                            <div className="settings__item-content">
                                <button className="logout-button" onClick={(event) => this.handleLogoutClick(event)}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="layout__footer">
                    <BottomNav/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        notificationsEnabled: state.notificationsEnabled
    }
};


const mapDispatchToProps = dispatch => {
    return {
        changeNotificationsEnabled: (value) => dispatch({type: ActionTypes.NOTIFICATIONS_ENABLED_CHANGE, value: value}),
        changeScreen: (value) => dispatch({type: ActionTypes.SCREEN_CHANGE, value: value}),
        changeWebSocket: (value) => dispatch({type: ActionTypes.WEBSOCKET_CHANGE, value: value}),
        changeUser: (value) => dispatch({type: ActionTypes.USER_CHANGE, value: value}),
        changeAuthenticated: (value) => dispatch({type: ActionTypes.AUTHENTICATED_CHANGE, value: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);