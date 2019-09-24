'use strict';
const {authenticate} = require("../app/middleware/SocketMiddleware");
const onlineUserRepository= require("../app/online-users/OnlineUserRepository");
const debug = require("debug")("app:debug");
const constants = require("../app/Constants");
const {

    //Events
    CONNECTION,
    CONNECTED,
    EVENT_INITIALIZATION,
    EVENT_SEND_MESSAGE,
    EVENT_MARK_MESSAGE_AS_DELIVERED,
    EVENT_SAVE_USER_CHAT,
    EVENT_GET_OLDER_MESSAGE,
    DISCONNECTED,

    EMIT_RECEIVE_MESSAGE
    //Emissions
} = require('./constants');

const init = (io) => {
    // let io = require('socket.io')(server);
    ioEvents(io);

    redisEventManager.subscriber.on("message", (channel, message) => {
        debug("Here",);
        console.log("Message: " + message + " on channel: " + channel + " has arrive!");

        switch (channel) {
            case constants.MESSAGES:{
                const payload = JSON.parse(message);
                debug(payload);
                payload.socketIds.map(socketId => {
                    io.to(socketId).emit(EMIT_RECEIVE_MESSAGE, { message: payload.message });
                    debug(`Sent to ${socketId} from ${process.env.PORT}`);
                });
                break;
            }

            default: {
                console.log("No Channel is listening");
                break;
            }
        }
    });

    redisEventManager.subscriber.subscribe(constants.MESSAGES);
    return io;
};

//Controller
const messageController = require('../app/messages/MessageController');

/**
 * This Methods handles all events and emitters of the socket
 * @param io
 */
const ioEvents = (io) => {
    io.sockets.on(CONNECTION, (socket) => {
        // debug(`${socket.id} is connected on worker ${workerId}`);
        socket.emit(CONNECTED,{payload: socket.id});
        /**
         * Initialization Event
         */
        socket.on(EVENT_INITIALIZATION,(payload) => {
            try{
                // console.log("Init: " + JSON.stringify(payload));
                if(payload.userId !== undefined || payload.user !== null){
                    socket.auth = true;
                    socket.userId = payload.userId;
                    //add user to online-users table
                    onlineUserRepository.add(socket.userId, socket.id)
                        .then(res => null)
                        .catch(err => debug("FATAL ERROR", err));
                    messageController.fetchMessages(socket,payload.lastMessageId || 0, payload.limit);
                }else{
                    socket.disconnect(true);
                }
            }catch (e) {
                debug("FATAL ERROR", e);
                socket.disconnect(true);
            }
        });

        socket.on(EVENT_SEND_MESSAGE,(payload) => {
            messageController.send(io, socket, payload)
        });

        socket.on(EVENT_MARK_MESSAGE_AS_DELIVERED, (payload) => {
           messageController.markAsDelivered(payload);
        });

        socket.on(EVENT_SAVE_USER_CHAT, (payload) => {
            messageController.saveUserChats(payload);
        });

        socket.on(EVENT_GET_OLDER_MESSAGE, ({startMessageId, recipient, limit}) => {
            messageController.fetchOldMessages(socket,recipient,startMessageId,limit);
        });

        /**
         * Disconnect User and Remove from Online users
         */
        socket.on(DISCONNECTED, () => {
            debug(`${socket.id} has disconnected`);
            onlineUserRepository.remove(socket.userId, socket.id);
        });
    });
};

module.exports={
    init
};
