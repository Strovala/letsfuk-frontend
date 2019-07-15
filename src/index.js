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
import {apiUrl} from "./globals/constants";

axios.defaults.baseURL = apiUrl;

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

axios.interceptors.response.use(response => {
    let responseData = {...response.data};
    response.data = humps.camelizeKeys(responseData);
    return response;
}, error => {
    return Promise.reject(error);
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
