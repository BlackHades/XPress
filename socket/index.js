'use strict';
const {authenticate} = require("../app/middleware/SocketMiddleware");
const onlineUserRepository= require("../app/api/online-users/OnlineUserRepository");
const {

    //Events
    CONNECTION,
    CONNECTED,
    EVENT_INITIALIZATION,
    EVENT_AUTHENTICATION,
    EVENT_USER_INFO,
    EVENT_SEND_MESSAGE,
    EVENT_FETCH_MESSAGE,
    EVENT_MARK_MESSAGE_AS_DELIVERED,
    DISCONNECTED,

    //Emissions
    EMIT_AUTHENTICATED,
    EMIT_MESSAGE,
    EMIT_ERROR
} = require('./constants');

const init = (server) => {
    let io = require('socket.io')(server);
    ioEvents(io);
};

//Controller
const messageController = require('../app/api/messages/MessageController');

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
            // console.log("Init: " + JSON.stringify(payload));
            if(payload.userId !== undefined || payload.user !== null){
                socket.auth = true;
                socket.userId = payload.userId;
                // console.log("Initialized: " + socket);
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

        /**
         * Disconnect User and Remove from Online users
         */
        socket.on(DISCONNECTED, () => {
           try{
               //remove user from online-users table
               onlineUserRepository.remove(socket.userId, socket.id);
               // console.log(socket.id + " has disconnected");
           }catch (e) {
               socket.disconnect(true);
           }
        });
    });
};

module.exports= init;

