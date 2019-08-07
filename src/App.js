import React  from 'react';
import {connect} from "react-redux";
import LandingLayout from "./components/Layout/LandingLayout/LandingLayout";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import "./index.scss";

const app = (props) => {
    const layout = props.authenticated ? <MainLayout/> : <LandingLayout/>;
    return (
        <div className="app">
            {layout}
        </div>
    )
};

const mapStateToProps = state => {
    return {
        authenticated: state.authenticated
    }
};

export default connect(mapStateToProps)(app);
