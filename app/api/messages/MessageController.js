const userRepository =  require("../users/UserRepository");
const onlineUserRepository =  require("../online-users/OnlineUserRepository");
const {
    EMIT_RECEIVE_MESSAGE,
    EMIT_ERROR
} = require("../../../socket/constants");

const messageRepository = require("./MessageRepository");

const userConstant = require("../users/UserConstant");

const log = require("../../../helpers/Logger");

/**
 * Fetch Recent Messaged
 * @param socket
 * @param lastMessageId
 */
const fetchMessages = async (socket,lastMessageId) => {
    let messages = await messageRepository.fetchMessage(socket.userId,lastMessageId);
    messages.forEach(message => {
        socket.emit(EMIT_RECEIVE_MESSAGE,{message:message});
    });
};


//Send Message
const send = async (io,socket,payload) => {
    try{
        console.log("Message Payload: " + JSON.stringify(payload));
        console.log("Message Payload: " + socket.userId);
        console.log("Message Payload: " + socket.id);

        let message = payload.message;

        //validate Message Object
        if(message.from == null || message.content == null || message.type == null){
            socket.emit(EMIT_ERROR,"One or More Fields is required");
            return;
        }

        //get user
        let user = await userRepository.find(socket.userId);
        if(!user){
            //if user is not found emit an error
            socket.emit(EMIT_ERROR,"User Not Found");
            return;
        }

        //replace from or to with system id
        if(user.roleId !== userConstant.USER){
            message.from = userConstant.SYSTEM;
            message.agentId = user.id;
        }
        else{
            message.to = userConstant.SYSTEM;
        }
        //Save Message Object
        let messageCreated = await messageRepository.create(message);
        message = await messageRepository.findByMessageId(messageCreated.mid);
        //if message was sent from a user
        if(message.from !== userConstant.SYSTEM){
            //emit data to all agents stream
            disperseMessageToAllAgentAndAdmins(io, message);
        }else{
            //emit data to user if online
            disperseMessageToUser(io,message)

        }
    }catch (e) {
        console.log("Error Handler: " + JSON.stringify(e));
    }
};



const emitMessage = (io,socketId,message) => {
    io.to(socketId).emit(EMIT_RECEIVE_MESSAGE,{message:message})
};


const disperseMessageToAllAgentAndAdmins = async (io,message) => {
    let nonUsers = await userRepository.getAllNonUser(true);
    let nonUserIds = [];
    for(let i = 0; i < nonUsers.length; i++){
        nonUserIds[i] = nonUsers[i].id;
    }

    let onlineUsers = await onlineUserRepository.getMultipleOnlineUsersById(nonUserIds,true);
    onlineUsers.forEach(user => {
        console.log("socketId: " + user.socketId);
        emitMessage(io, user.socketId, message);
    })
};

const disperseMessageToUser = async (io,message) => {
    let onlineUsers = await onlineUserRepository.findByUserId(message.to);
    onlineUsers.forEach(user => {
       console.log("User: " + JSON.stringify(user));
        emitMessage(io, user.socketId, message);
    });
};

/**
 *
 * mark message as delivered
 */
const markAsDelivered = async (payload) => {
    log("PayloadDelivered: " + JSON.stringify(payload));
    let message = await messageRepository.findByMessageId(payload.mid);
    console.clear();
    log("Message: " + JSON.stringify(message));
    if(message.status < 2)
        messageRepository.update(payload.mid,{
            status: 2
        }).then(data => {
            log("delivered: " + JSON.stringify(data));
        }).catch(error => {
            log("delivered: " + JSON.stringify(error));
        })
};

module.exports = {
    fetchMessages,
    send,
    markAsDelivered
};