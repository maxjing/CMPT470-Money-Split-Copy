import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import axios from 'axios';
import UserService from "./user/userService";

const userService = new UserService()
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem("token")
    if (token) {
        userService.refreshToken(token).then(resp => {
            localStorage.setItem("token", resp.data.token)
        }).catch(e => {
        })
        config.headers.Authorization = `JWT ${token}`
    }
    return config;
}, function (error) {
    // Do something with request error

    console.log(error)
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    let token = localStorage.getItem("token")
    if (error.response.status === 401 || error.response.status === 400) {
        userService.verifyToken(token).then((e) => {
            //console.log(e)
        }).catch(() => {
            localStorage['token'] = ""
            window.location = "/user/login"
        })
    }
    return Promise.reject(error);
});

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
