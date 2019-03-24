const userRepository =  require("../users/UserRepository");
const onlineUserRepository =  require("../online-users/OnlineUserRepository");
const cardRepository =  require("../cards/CardRepository");
const {
    EMIT_RECEIVE_MESSAGE,
    EMIT_MESSAGE_SENT,
    EMIT_ERROR
} = require("../../../socket/constants");

const messageRepository = require("./MessageRepository");

const messageConstant = require("./MessageConstant");

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
const send = async (io, socket, payload) => {
    try{
        console.log("Message Payload: " + JSON.stringify(payload));
        console.log("Message Payload: " + socket.userId);
        console.log("Message Payload: " + socket.id);

        let message = payload.message;

        //validate Message Object
        if(message.from == null || message.to == null || message.content == null || message.type == null){
            socket.emit(EMIT_ERROR,"One or More Fields is required");
            return;
        }

        //get user
        let sender = await userRepository.find(message.from);
        let receiver = await userRepository.find(message.to);
        if(!sender){
            //if user is not found emit an error
            socket.emit(EMIT_ERROR,"Sender Not Found");
            return;
        }

        if(!receiver){
            //if receiver is not found emit an error
            socket.emit(EMIT_ERROR,"Receiver Not Found");
            return;
        }

        if(sender.roleId === receiver.roleId){
            socket.emit(EMIT_ERROR,"You cant send message to someone of the same role type");
            return;
        }
        //Save Message Object
        let newMessage = await messageRepository.create(message);
        newMessage.dataValues.sender = sender;
        newMessage.dataValues.receiver = receiver;
        if(newMessage.type === messageConstant.TYPE_CARD)
            newMessage.dataValues.card = await cardRepository.find(newMessage.cardId);


        console.log("Message: " +JSON.stringify(newMessage));
        disperseMessageToUser(io,newMessage);
        socket.emit(EMIT_MESSAGE_SENT,{message:newMessage});
    }catch (e) {
        console.log("Error Handler: " + JSON.stringify(e));
        socket.emit(EMIT_ERROR,JSON.stringify(e));
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

    //send onesignal integration
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