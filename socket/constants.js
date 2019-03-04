const CONNECTION = "connection";
const CONNECTED = "connected";
const DISCONNECTED = "disconnect";
const EVENT_INITIALIZATION = "event-initialization";
const EVENT_AUTHENTICATION = "event-authentication";
const EVENT_USER_INFO = "event-user-info";
const EVENT_SEND_MESSAGE = "event-send-message";
const EVENT_FETCH_MESSAGE = "event-fetch-message";

//Emissions
const EMIT_ERROR = "emit-error";
const EMIT_AUTHENTICATED = "emit-authenticated";
const EMIT_RECEIVE_MESSAGE = "emit-receive-message";
module.exports = {
    CONNECTION,
    CONNECTED,
    EVENT_INITIALIZATION,
    EVENT_AUTHENTICATION,
    EVENT_USER_INFO,
    DISCONNECTED,
    EVENT_SEND_MESSAGE,
    EVENT_FETCH_MESSAGE,

    //Emissions
    EMIT_ERROR,
    EMIT_AUTHENTICATED,
    EMIT_RECEIVE_MESSAGE
};