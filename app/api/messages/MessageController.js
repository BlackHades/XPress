const userRepository =  require("../users/UserRepository");
const {
    EMIT_RECEIVE_MESSAGE,
    EMIT_ERROR
} = require("../../../socket/constants");

const messageRepository = require("./MessageRepository");

const userConstant = require("../users/UserConstant");

const fetchMessages = (socket,lastMessageId) => {
    for(let i = 0; i < 50; i++){
        emitMessage(socket,i);
    }
};


//Send Message
const send = async (io,socket,payload) => {
    try{
        console.log("Message Payload: " + JSON.stringify(payload));
        console.log("Message Payload: " + socket.userId);
        console.log("Message Payload: " + socket.id);

        const message = payload.message;

        //validate Message Object
        if(message.from == null || message.content == null || message.type == null){
            socket.emit(EMIT_ERROR,"One or More Fields is required");
            return;
        }

        //get user
        let user = await userRepository.find(socket.userId);
        if(!user){
            socket.emit(EMIT_ERROR,"User Not Found");
            return;
        }

        if(user.roleId === userConstant.AGENT){
            message.from = userConstant.SYSTEM;
            message.agentId = user.id;
        }
        else
            message.to = userConstant.SYSTEM;

        //Save Message Object
        let messageCreated = await messageRepository.create(message);



        console.log("User: " + JSON.stringify(messageCreated));
        //Emit Stream to User and agents


        //if sender is an agent -  emit to user if online


        //if sender us user, emit to all agent pool
    }catch (e) {
        console.log("Error Handler: " + JSON.stringify(e));
    }
};



const emitMessage = (socket,message) => {
    socket.emit(EMIT_RECEIVE_MESSAGE,{message:message})
};

module.exports = {
    fetchMessages,
    send
};