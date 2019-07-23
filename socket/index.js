'use strict';
const {authenticate} = require("../app/middleware/SocketMiddleware");
const onlineUserRepository= require("../app/online-users/OnlineUserRepository");
const debug = require("debug")("app:debug");
const {

    //Events
    CONNECTION,
    CONNECTED,
    EVENT_INITIALIZATION,
    EVENT_SEND_MESSAGE,
    EVENT_MARK_MESSAGE_AS_DELIVERED,
    EVENT_SAVE_USER_CHAT,
    DISCONNECTED,

    //Emissions
} = require('./constants');

const init = (io) => {
    // let io = require('socket.io')(server);
    ioEvents(io);
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
        socket.emit(CONNECTED,{payload: socket.id});
        socket.auth = false;
        /**
         * Initialization Event
         */
        socket.on(EVENT_INITIALIZATION,(payload) => {
            console.log("Init: " + JSON.stringify(payload));
            if(payload.userId !== undefined || payload.user !== null){
                socket.auth = true;
                socket.userId = payload.userId;
                //add user to online-users table
                onlineUserRepository.add(socket.userId, socket.id);
                messageController.fetchMessages(socket,payload.lastMessageId || 0, payload.limit);
            }else{
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

        /**
         * Disconnect User and Remove from Online users
         */
        socket.on(DISCONNECTED, () => {
            onlineUserRepository.remove(socket.userId, socket.id);
        });
    });
};

module.exports={
    init
};
