import axios from "axios";
import {cookies} from "./constants";

const checkUserFromCookie = () => {
    const sessionId = cookies.get('session-id');
    if (sessionId) {
        const userId = cookies.get('user-id');
        if (userId) {
            return {
                sessionId: sessionId,
                userId: userId
            };
        }
    }
    return {
        sessionId: null,
        userId: null
    };
};

class API {

    static getUser(data) {
        axios.get(`/users/${data.userId}`, { headers: { "session-id": data.sessionId } })
            .then(data.response)
            .catch(data.error);
    };

    static logout(data) {
        axios.post('/auth/logout', {}, {headers: {"session-id": data.sessionId}})
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
        axios.get('/messages', {headers: {"session-id": data.sessionId}})
            .then(data.response)
            .catch(data.error);
    }
}

export { API, checkUserFromCookie };