import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import humps from "humps";

axios.defaults.baseURL = 'http://localhost:8888';


axios.interceptors.request.use(request => {
    console.log(request);
    return request;
}, error => {
    console.log(error.response.data);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    console.log(response.data);
    let responseData = {...response.data};
    response.data = humps.camelizeKeys(responseData);
    return response;
}, error => {
    console.log(error.response.data);
    return Promise.reject(error);
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
