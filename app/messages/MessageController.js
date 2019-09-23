const userRepository = require("../users/UserRepository");
const onlineUserRepository = require("../online-users/OnlineUserRepository");
const pushTokenRepository = require("../push-notifications/PushTokenRepository");
const onesignalRepository = require("../push-notifications/OnesignalRepository");
const cardRepository = require("../cards/CardRepository");
const userChatRepository = require("../user-chats/UserChatRepository");
const {
    EMIT_RECEIVE_MESSAGE,
    EMIT_MESSAGE_SENT,
    EMIT_MESSAGE_IN_BULK,
    EMIT_ERROR
} = require("../../socket/constants");

const messageRepository = require("./MessageRepository");

const messageConstant = require("./MessageConstant");

const log = require("../../helpers/Logger");
const { createSuccessResponse } = require("../../helpers/response");
const debug = require("debug")("app:debug");



const fetchMessages = async (socket, lastMessageId, limit) => {
    let messages;
    try {
        let userChatList = await userChatRepository.findOne({ userId: socket.userId });
        let list = [];
        if (!userChatList || userChatList.chatList.length == 0) {
            messages = await messageRepository.fetchMessage(socket.userId, lastMessageId, limit);
            let list = [];
            await Promise.all(messages.map(message => {
                list = createChatList(message, message.from === socket.userId ? "sent" : "received", list);
            }));
            socket.emit(EMIT_MESSAGE_IN_BULK, { list });
        } else {
            debug("Error", userChatList.chatList);
            let chatList = userChatList.chatList ? JSON.parse(userChatList.chatList) : [];
            if (chatList) {
                for (let ch of chatList) {
                    ch.messages = await messageRepository.fetchMessageBySenderAndRecipient(socket.userId, ch.id, lastMessageId);
                    list.push(ch.messages.reverse());
                }
                socket.emit(EMIT_MESSAGE_IN_BULK, { list });
            }
        }
    } catch (e) {
        debug("FATAL ERROR", e);
        messages = await messageRepository.fetchMessage(socket.userId, lastMessageId, limit);
        let list = [];
        await Promise.all(messages.map(message => {
            list = createChatList(message, message.from === socket.userId ? "sent" : "received", list);
        }));
        socket.emit(EMIT_MESSAGE_IN_BULK, { list });
    }
};

const fetchOldMessages = async (socket, recipient, startMessageId, limit) => {
    const messages = await messageRepository.fetchMessageBySenderAndRecipientReverse(socket.userId, recipient, startMessageId, limit || 20);
    socket.emit(EMIT_MESSAGE_IN_BULK, { recipient, list: messages.reverse() });

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
    }
    else {
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
        if (matchedMessages.length === 0)
            user.messages.unshift(message);
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
    return createSuccessResponse(res, await messageRepository.fetchMessage(req.user.id, req.body.lastMessageId || 0, req.body.limit || 50));
};


//Send Message
const send = async (io, socket, payload) => {
    try {
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
        socket.emit(EMIT_MESSAGE_SENT, { message: newMessage });
    } catch (e) {
        socket.emit(EMIT_ERROR, JSON.stringify(e));
    }
};


const emitMessage = (io, socketId, message) => {
    io.to(socketId).emit(EMIT_RECEIVE_MESSAGE, { message: message })
};


const disperseMessageToUser = (io, message) => {
    onlineUserRepository.findByUserId(message.to)
        .then(onlineUsers => {
            onlineUsers.forEach(user => {
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
            const data = { notificationType: "MESSAGE", message: message };
            log("data: " + JSON.stringify({ data: data, tokens: tokens, message: message }));
            onesignalRepository.sendNotificationToUser(tokens, message.sender.name, message.content, data)
        }).catch(err => log("pusherror: " + err));
};

/**
 *
 * mark message as delivered
 */
const markAsDelivered = async (payload) => {
    let message = await messageRepository.findByMessageId(payload.mid);
    if (message.status < 2)
        messageRepository.update(payload.mid, {
            status: 2
        }).then(data => {
            log("delivered: " + JSON.stringify(data));
        }).catch(error => {
            log("delivered: " + JSON.stringify(error));
        })
};



const saveUserChats = async ({ userId, chatList }) => {
    let userChatList = await userChatRepository.findOne({ userId });
    if (!userChatList) {
        userChatList = await userChatRepository.create({
            userId,
            chatList
        });
    } else {
        userChatList.chatList = chatList;
        userChatList = await userChatList.save();
    }
};

module.exports = {
    fetchMessages,
    send,
    markAsDelivered,
    fetchMessagesRequest,
    saveUserChats,
    fetchOldMessages
};