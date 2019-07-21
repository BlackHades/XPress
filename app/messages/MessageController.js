const userRepository = require("../users/UserRepository");
const onlineUserRepository = require("../online-users/OnlineUserRepository");
const pushTokenRepository = require("../push-notifications/PushTokenRepository");
const onesignalRepository = require("../push-notifications/OnesignalRepository");
const cardRepository = require("../cards/CardRepository");
const {
    EMIT_RECEIVE_MESSAGE,
    EMIT_MESSAGE_SENT,
    EMIT_MESSAGE_IN_BULK,
    EMIT_ERROR
} = require("../../socket/constants");

const messageRepository = require("./MessageRepository");

const messageConstant = require("./MessageConstant");

const log = require("../../helpers/Logger");
const {createSuccessResponse} = require("../../helpers/response");

/**
 * Fetch Recent Messaged
 * @param socket
 * @param lastMessageId
 * @param limit
 */
const fetchMessages = async (socket, lastMessageId, limit) => {
    let messages = await messageRepository.fetchMessage(socket.userId, lastMessageId, limit);

    let list = [];
    messages.map(message => {
        list = createChatList(message, message.from === socket.userId ? "sent" : "received", list);
    });
    socket.emit(EMIT_MESSAGE_IN_BULK, {list});
};


const createChatList = (message, type, list = []) => {

    let user;
    if (type === 'received') {
        for (let i = 0; i < list.length; i++) {
            //check list and match a record to the message sender
            if (list[i].id === message.from) {
                user = list[i];
                //splice
                list.splice(i, 1);
                break;
            }
        }
    } else {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === message.to) {
                user = list[i];
                list.splice(i, 1);
                break;
            }
        }
    }
    if (user) {
        const matchedMessages = user.messages.filter(m => message.mid === m.mid);
        if (matchedMessages.length === 0) {
            user.messages.unshift(message);
        }
    } else {
        if (message) {
            if (type === "received") {
                user = {
                    id: message.sender.id,
                    name: message.sender.name,
                    avatar: message.sender.avatar,
                    roleId: message.sender.roleId,
                    messages: [message],
                }
            } else {
                user = {
                    id: message.receiver.id,
                    name: message.receiver.name,
                    avatar: message.receiver.avatar,
                    roleId: message.receiver.roleId,
                    messages: [message],
                }
            }
        }
    }
    list.unshift(user);
    return list;
};


const fetchMessagesRequest = async (req, res) => {
    log(req.body.lastMessageId);
    return createSuccessResponse(res, await messageRepository.fetchMessage(req.user.id, req.body.lastMessageId || 0, req.body.limit || 50));
};


//Send Message
const send = async (io, socket, payload) => {
    try {
        console.log("Message Payload: " + JSON.stringify(payload));
        console.log("Message Payload: " + socket.userId);
        console.log("Message Payload: " + socket.id);

        let message = payload.message;

        //validate Message Object
        if (message.from == null || message.to == null || message.content == null || message.type == null) {
            socket.emit(EMIT_ERROR, "One or More Fields is required");
            return;
        }

        //get user
        let sender = await userRepository.find(message.from);
        let receiver = await userRepository.find(message.to);
        if (!sender) {
            //if user is not found emit an error
            socket.emit(EMIT_ERROR, "Sender Not Found");
            return;
        }

        if (!receiver) {
            //if receiver is not found emit an error
            socket.emit(EMIT_ERROR, "Receiver Not Found");
            return;
        }

        if (sender.roleId === receiver.roleId) {
            socket.emit(EMIT_ERROR, "You cant send message to someone of the same role type");
            return;
        }
        //Save Message Object
        let newMessage = await messageRepository.create(message);
        // newMessage.dataValues.sender = sender;
        // newMessage.dataValues.receiver = receiver;
        // if(newMessage.type === messageConstant.TYPE_CARD)
        //     newMessage.dataValues.card = await cardRepository.find(newMessage.cardId);
        newMessage = await messageRepository.findByMessageId(newMessage.mid);


        console.log("Message: " + JSON.stringify(newMessage));
        disperseMessageToUser(io, newMessage);

        //Emit Message Sent
        socket.emit(EMIT_MESSAGE_SENT, {message: newMessage});
    } catch (e) {
        console.log("Error Handler: " + JSON.stringify(e));
        socket.emit(EMIT_ERROR, JSON.stringify(e));
    }
};


const emitMessage = (io, socketId, message) => {
    io.to(socketId).emit(EMIT_RECEIVE_MESSAGE, {message: message})
};


const disperseMessageToAllAgentAndAdmins = async (io, message) => {
    let nonUsers = await userRepository.getAllNonUser(true);
    let nonUserIds = [];
    for (let i = 0; i < nonUsers.length; i++) {
        nonUserIds[i] = nonUsers[i].id;
    }

    let onlineUsers = await onlineUserRepository.getMultipleOnlineUsersById(nonUserIds, true);
    onlineUsers.forEach(user => {
        console.log("socketId: " + user.socketId);
        emitMessage(io, user.socketId, message);
    })
};

const disperseMessageToUser = (io, message) => {
    onlineUserRepository.findByUserId(message.to)
        .then(onlineUsers => {
            onlineUsers.forEach(user => {
                console.log("User: " + JSON.stringify(user));
                emitMessage(io, user.socketId, message);
            });
        })
        .catch(err => log(err));


    //send onesignal integration
    pushTokenRepository.fetchUserTokens(message.to, true)
        .then(tokens => {
            log("messages: " + JSON.stringify(message));
            if (tokens.length === 0)
                return;
            tokens = tokens.map(t => t.token);
            const data = {notificationType: "MESSAGE", message: message};
            log("data: " + JSON.stringify({data: data, tokens: tokens, message: message}));
            onesignalRepository.sendNotificationToUser(tokens, message.sender.name, message.content, data)
        }).catch(err => log("pusherror: " + err));
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
    if (message.status < 2)
        messageRepository.update(payload.mid, {
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
    markAsDelivered,
    fetchMessagesRequest
};