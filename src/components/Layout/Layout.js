import React from 'react';

import { ScreenContext, UserContext, Screens } from './../../App';
import ChatList from "../ChatList/ChatList";
import Aux from './../../hoc/Aux';
import BottomNavigation from './../BottomNavigation/BottomNavigation';
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";

const layout = (props) => {
    return (
        <ScreenContext.Consumer>
            {screen => (
                <UserContext.Consumer>
                    {user => {
                        let specificScreen = null;
                        let newProps = {...props};
                        newProps.user = user;
                        newProps.screen = screen;
                        console.log("Screen " + screen);
                        console.log("User " + user);
                        if (screen === Screens.CHATLIST) {
                            specificScreen = (
                                <Aux>
                                    <div><button>Backbutton</button></div>
                                    <div>
                                        <ChatList {...newProps} />
                                    </div>
                                    <BottomNavigation {...newProps}/>
                                </Aux>
                            )
                        } else if (screen === Screens.SIGNUP) {
                            specificScreen = (
                                <Aux>
                                    <div><button>Backbutton</button></div>
                                    <div>
                                        <SignUp {...newProps} />
                                    </div>
                                    <button onClick={(event) => {
                                        props.changeScreen(Screens.LOGIN)
                                    }}>Login</button>
                                </Aux>
                            )
                        } else if (screen === Screens.LOGIN) {
                            specificScreen = (
                                <Aux>
                                    <div><button>Backbutton</button></div>
                                    <div>
                                        <Login {...newProps} />
                                    </div>
                                    <button onClick={(event) => {
                                        props.changeScreen(Screens.SIGNUP)
                                    }}>Sign Up</button>
                                </Aux>
                            )
                        }
                        return specificScreen;
                    }}
                </UserContext.Consumer>
            )}
        </ScreenContext.Consumer>
    );
};

export default layout;
