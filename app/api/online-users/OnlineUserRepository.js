const {OnlineUser} = require("../../../database/sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const add = async (userId, socketId) => {

    //just truncate for now
    // await OnlineUser.truncate();
    return OnlineUser.create({
        userId:userId,
        socketId:socketId
    });
};


const remove = (userId, socketId) => {
    return OnlineUser.destroy({where:{userId:userId,socketId:socketId}});
};


const getMultipleOnlineUsersById = (userIds,onlySocketId = false) => {
    if(onlySocketId){
        return OnlineUser.findAll({
            where:{
                userId:{[Op.in]:userIds}
            },attributes:["socketId"]
        });
    }else
        return OnlineUser.findAll({
            where:{
                id:{[Op.in]:userIds}
            }
        });
};


const findByUserId = (userId, onlySocketId) => {

    if(onlySocketId){
        return OnlineUser.findAll({
            where:{userId:userId},
            attributes:["socketId"]
        })
    }else{
        return OnlineUser.findAll({
            where:{userId:userId}
        })
    }
};

module.exports = {
  add, remove, getMultipleOnlineUsersById,findByUserId
};