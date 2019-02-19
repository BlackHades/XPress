const {
    EMIT_MESSAGE
} = require("../../../socket/constants");
const fetchMessages = (socket,lastMessageId) => {
    for(let i = 0; i < 50; i++){
        emitMessage(socket,i);
    }
};





const emitMessage = (socket,message) => {
    socket.emit(EMIT_MESSAGE,{message:message})
};

module.exports = {
  fetchMessages
};