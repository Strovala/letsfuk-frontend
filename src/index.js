import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import humps from "humps";
import {createStore} from "redux";
import reducer from "./store/reducer";
import {Provider} from "react-redux";

axios.defaults.baseURL = 'http://localhost:8888';

const store = createStore(reducer);

axios.interceptors.response.use(response => {
    let responseData = {...response.data};
    response.data = humps.camelizeKeys(responseData);
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
