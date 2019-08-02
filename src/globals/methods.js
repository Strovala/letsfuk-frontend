import axios from "axios";
import {Constants, cookies} from "./constants";
import humps from "humps";
import {ReactIndexedDB} from "react-indexed-db";

class API {
    static getFromCache(url, channel, data) {
        if ('caches' in window) {
            const apiUrl = `${axios.defaults.baseURL}${url}`;
            caches.match(apiUrl)
                .then(response => {
                    if (response && !channel.dataReceived) {
                        response.json()
                            .then(responseData => {
                                console.log('from cache', responseData);
                                response.data = humps.camelizeKeys(responseData);
                                data.response(response);
                            })
                    }
                })
        }
    }

    static getFromIndexedDB(store, key, data) {
        return new Promise(function(resolve, reject) {
            if ('indexedDB' in window) {
                indexedDB.getByKey(store, key)
                    .then(val => {
                        if (val) {
                            console.log('from indexesdb', val);
                            data.response({data: val});
                            return true
                        }
                        return false
                    })
                    .then(success => {
                        resolve(success)
                    });
            }
        });
    }

    static whoAmI(data) {
        let url = `/whoami`;
        const sessionId = cookies.get('session-id');
        if (!sessionId)
            return;
        axios.get(url, { headers: { "session-id": sessionId } })
            .then(data.response)
            .catch(data.error);
    }

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
        let url = '/messages';
        if (data.limit)
            url = `/messages?limit=${data.limit}`;
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.get(url, {headers: {"session-id": sessionId}})
            .then(response => {
                data.response(response)
            })
            .catch(error => {
                API.getFromIndexedDB('chats', 'chats', data)
                    .then(success => {
                        if (!success && data.error)
                            data.error(error);
                    });
            });
    }

    static getMessages(data) {
        let url = `/messages/${data.receiverId}?limit=${data.limit}`;
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.get(url, {headers: {"session-id": sessionId}})
            .then(response => {
                data.response(response)
            })
            .catch(error => {
                API.getFromIndexedDB('messages', data.receiverId, data)
                    .then(success => {
                        if (!success && data.error)
                            data.error(error);
                    });
            });
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

    static getUserStation(data) {
        let url = `/users/${data.user.user.userId}/station`;
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.get(url, {headers: {"session-id": sessionId}})
            .then(response => {
                data.response(response)
            })
            .catch(data.error);
    }

    static subscribeToStation(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.post('/stations/subscribe', data.data, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static subscribePushNotification(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.post('/push-notifications/subscribe', data.data, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static unsubscribePushNotification(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        axios.post('/push-notifications/unsubscribe', data.data, {headers: {"session-id": sessionId}})
            .then(data.response)
            .catch(data.error);
    }

    static checkPushNotificationSubscription(data) {
        let sessionId = cookies.get('session-id');
        if (!sessionId) {
            sessionId = data.user.sessionId;
        }
        return axios.get('/push-notifications/check', {
            params: data.params,
            headers: {"session-id": sessionId}
        })
    }
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


const addTimeZoneOffset = (dateString) => {
    // Format string for safari
    dateString = dateString.replace(/\s/, 'T');
    // Cannot use newDate(dateString) because of Safari / Chrome problem
    const a = dateString.split(/[^0-9]/);
    const date = new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5]);
    const offset = new Date().getTimezoneOffset()/60;
    let hours = date.getHours() - offset;
    if (hours > 24) {
        hours = hours % 24;
        date.setHours(hours);
        let day = date.getDate() + 1;
        const daysInMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        if (day > daysInMonth) {
            day = day % daysInMonth;
            date.setDate(day);
            let month = date.getMonth() + 1;
            if (month > 12) {
                month = month % 12;
                date.setMonth(month);
                const year = date.getFullYear() + 1;
                date.setFullYear(year);
            }
        }
    }
    date.setHours(hours);
    return date
};

const formatSentAtForChatList = (dateString) => {
    const date = addTimeZoneOffset(dateString);
    // Returns offset in minutes
    const now = new Date();
    const diff = new Date() - date;
    const daysPassed = Math.floor(diff / 8.64e+7);
    const sentAt = getSentAt(date);
    if (daysPassed === 0) {
        const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
        const minutesPassed = Math.floor(diff / 60000);
        if (minutesPassed <= minutesSinceMidnight)
            return sentAt;
        return 'Yesterday'
    }
    if (daysPassed < 7) {
        if (daysPassed === 1) {
            return `Yesterday`
        }
        return `${days[date.getDay()]}`
    }
    const yearsPassed = Math.floor(diff / 3.154e+10);
    if (yearsPassed < 1) {
        return `${months[date.getMonth()]} ${date.getDate()}`
    }
    const formattedMonth = ("0" + date.getMonth()).slice(-2);
    const formattedDate = ("0" + date.getDate()).slice(-2);
    return `${formattedMonth}/${formattedDate}/${date.getFullYear()}`;
};

const formatSentAtForMessage = (dateString) => {
    const date = addTimeZoneOffset(dateString);
    const now = new Date();
    const diff = now - date;
    const daysPassed = Math.floor(diff / 8.64e+7);
    const sentAt = getSentAt(date);
    if (daysPassed === 0) {
        const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
        const minutesPassed = Math.floor(diff / 60000);
        if (minutesPassed <= minutesSinceMidnight)
            return sentAt;
    }
    return `${formatSentAtForChatList(dateString)}, ${sentAt}`
};

const getSentAt = (date) => {
    // Returns offset in minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = ("0" + minutes).slice(-2);
    return `${hours}:${formattedMinutes}`;
};

const trimLastMessageText = (text, size ) => {
    if (text.length > size) {
        text = `${text.substring(0, size)}...`;
    }
    return text;
};

const mobileCheck = function() {
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4)))
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

const tryNewStation = (data) => {
    navigator.geolocation.getCurrentPosition((location) => {
        const currentLocation = {
            lat: location.coords.latitude,
            lon: location.coords.longitude
        };
        API.getUserStation({
            user: data.user,
            response: response => {
                const stationLocation = response.data;
                // In meters
                const distance = distanceBetweenLocations(currentLocation, stationLocation);
                if (distance > Constants.DISTANCE_TRESHOLD) {
                    API.subscribeToStation({
                        user: data.user,
                        data: currentLocation
                    })
                }
            }
        });
    }, (error) => {},
    {
        maximumAge: 60000,
        timeout: 5000,
        enableHighAccuracy: true
    });
};

const distanceBetweenLocations = (location1, location2) => {
    const R = 6371e3; // metres
    const phi1 = location1.lat.toRad();
    const phi2 = location2.lat.toRad();
    const dphi = (location2.lat-location1.lat).toRad();
    const dlambda = (location2.lon-location1.lon).toRad();
    const a = Math.sin(dphi/2) * Math.sin(dphi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(dlambda/2) * Math.sin(dlambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
};


/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

const initDB = () => {
    indexedDB = new ReactIndexedDB('store', 1);
    indexedDB.openDatabase(1, (evt) => {
        evt.currentTarget.result.createObjectStore('chats', { keyPath: 'id' });
        evt.currentTarget.result.createObjectStore('messages', { keyPath: 'id' });
    }).then((info) => {
        console.log('Initialized indexedDB');
    });
    return indexedDB;
};
let indexedDB = initDB();


const clearCaches = () => {
    if ('caches' in window) {
        caches.keys().then(function (cacheKeys) {
            cacheKeys.map(cacheKey => {
                if (cacheKey.indexOf('workbox-precache') !== -1)
                    return null;
                if (cacheKey === 'google-fonts')
                    return null;
                return caches.delete(cacheKey);
            })
        });
    }
};

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const configurePushSub = (data) => {
    if (!('serviceWorker' in navigator))
        return;
    let reg;
    navigator.serviceWorker.ready
        .then(sw => {
            reg = sw;
            return sw.pushManager.getSubscription()
        })
        .then(sub => {
            if (sub === null) {
                // Create subscription
                const vapidPublicKey = 'BEX7QPgjsx85cMdCyQWPj28nSHSNUIxfMpd3FKztFw9ca__-8etdU6g6fiTYC_zRHnoP4r6Wv8DFl9o7JWI-SmI';
                const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                return reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPublicKey
                })
            } else {
                // We already subscribed update if it's new user, update it
                // in next promise chain
                return sub
            }
        })
        .then(newSub => {
            // send new sub to backend for storing
            API.subscribePushNotification({
                user: data.user,
                data: newSub.toJSON(),
                response: data.response
            });
        })
        .catch(err => {
            console.log(err);
        })
};

const getPushNotificationUserSub = (user) => {
    if (!('serviceWorker' in navigator))
        return null;
    return navigator.serviceWorker.ready
        .then(sw => {
            return sw.pushManager.getSubscription()
                .then(sub => {
                    if (sub !== null) {
                        const subJson = sub.toJSON();
                        return API.checkPushNotificationSubscription({
                            user: user,
                            params: {
                                endpoint: subJson.endpoint,
                                auth: subJson.keys.auth,
                                p256dh: subJson.keys.p256dh
                            }
                        })
                            .then(() => {
                                return sub;
                            })
                            .catch(error => {
                                console.log(error);
                                return null;
                            })
                    }
                    return sub
                })
        })
        .catch(err => {
            console.log(err);
        })
};

export { API, formatSentAtForChatList, formatSentAtForMessage, trimLastMessageText, mobileCheck, tryNewStation, indexedDB, clearCaches, configurePushSub, getPushNotificationUserSub };