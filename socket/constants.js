const CONNECTION = "connection";
const CONNECTED = "connected";
const DISCONNECTED = "disconnect";
const EVENT_INITIALIZATION = "event-initialization";
const EVENT_AUTHENTICATION = "event-authentication";
const EVENT_USER_INFO = "event-user-info";
const EVENT_SEND_MESSAGE = "event-send-message";
const EVENT_FETCH_MESSAGE = "event-fetch-message";
const EVENT_MARK_MESSAGE_AS_DELIVERED = "event-mark-message-as-delivered";
const EVENT_SAVE_USER_CHAT = "event-save-user-chat";
const EVENT_GET_OLDER_MESSAGE = "event-get-older-message-between-you-and-another-user";
//Emissions
const EMIT_ERROR = "emit-error";
const EMIT_AUTHENTICATED = "emit-authenticated";
const EMIT_RECEIVE_MESSAGE = "emit-receive-message";
const EMIT_MESSAGE_IN_BULK = "emit-receive-message-in-bulk";
const EMIT_MESSAGE_SENT = "emit-message-sent";
const EMIT_AGENT_STATUS = "emit-agent-status";
module.exports = {
    CONNECTION,
    CONNECTED,
    EVENT_INITIALIZATION,
    EVENT_AUTHENTICATION,
    EVENT_USER_INFO,
    DISCONNECTED,
    EVENT_SEND_MESSAGE,
    EVENT_FETCH_MESSAGE,
    EVENT_MARK_MESSAGE_AS_DELIVERED,
    EVENT_SAVE_USER_CHAT,
    EVENT_GET_OLDER_MESSAGE,


    //Emissions
    EMIT_ERROR,
    EMIT_AUTHENTICATED,
    EMIT_RECEIVE_MESSAGE,
    EMIT_MESSAGE_SENT,
    EMIT_MESSAGE_IN_BULK,
    EMIT_AGENT_STATUS
};