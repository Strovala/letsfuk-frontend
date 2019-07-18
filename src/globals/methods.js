import axios from "axios";
import {cookies} from "./constants";

class API {

    static whoAmI(data) {
        const sessionId = cookies.get('session-id');
        if (!sessionId)
            return;
        axios.get('/whoami', { headers: { "session-id": sessionId } })
            .then(data.response)
            .catch(data.error);
    }

    static getUser(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.get(`/users/${data.userId}`, { headers: { "session-id": sessionId } })
            .then(data.response)
            .catch(data.error);
    };

    static logout(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.post('/auth/logout', {}, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static login(data) {
        axios.post('/auth/login', data.data)
            .then(data.response)
            .catch(data.error);
    }

    static register(data) {
        axios.post('/users', data.data)
            .then(data.response)
            .catch(data.error);
    }

    static getChats(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.get('/messages', {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static getMessages(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.get(`/messages/${data.receiverId}?limit=${data.limit}`, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static sendMessage(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.post('messages', data.data, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static resetUnreadMessages(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.put('/messages/unreads/reset', data.data, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }
}

const formatSentAt = (dateString) => {
    // Format string for safari
    dateString = dateString.replace(/\s/, 'T');
    // Cannot use newDate(dateString) because of Safari / Chrome problem
    const a = dateString.split(/[^0-9]/);
    const date=new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5]);
    // Returns offset in minutes
    const offset = new Date().getTimezoneOffset()/60;
    const hours = date.getHours() - offset;
    const minutes = date.getMinutes();
    const formattedMinutes = ("0" + minutes).slice(-2);
    return `${hours}:${formattedMinutes}`
};

const trimLastMessageText = (text, size ) => {
    if (text.length > size) {
        text = `${text.substring(0, size)}...`;
    }
    return text;
};

export { API, formatSentAt, trimLastMessageText };