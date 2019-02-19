'use strict';
const {authenticate} = require("../app/middleware/SocketMiddleware");
const {

    //Events
    CONNECTION,
    CONNECTED,
    EVENT_INITIALIZATION,
    EVENT_AUTHENTICATION,
    EVENT_USER_INFO,
    EVENT_SEND_MESSAGE,
    EVENT_FETCH_MESSAGE,
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
        console.log(socket.id + " is connected");
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
                console.log("Initialized: " + socket);
                messageController.fetchMessages(socket,0);
            }else{
                socket.disconnect(true);
            }
        });

        /**
         * Disconnect User and Remove from Online users
         */
        socket.on(DISCONNECTED, (payload) => {
            console.log(socket.id + " is disconnected");
        });
    });
};

module.exports= init;

