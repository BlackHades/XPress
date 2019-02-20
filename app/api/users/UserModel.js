
const roles = require('./UserConstant');


// let UserSchema = new Schema({
//     roleId:{type: Number, required:true, default: roles.USER},
//     name:{type: String, required:true},
//     email: {type: String, required: true, max: 200},
//     password:{type:String, required:true},
//     createdAt: {type: Date, default: Date.now},
//     updatedAt: {type: Date, default: Date.now},
//     createdBy: {type: Number},
// });

module.exports = (sequelize, type) => {

    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid:{
            type: type.STRING,
            unique: true
        },
        roleId:{
            type: type.INTEGER,
            defaultValue: roles.USER,
        },
        name: type.STRING,
        email: {
            type: type.STRING,
            unique: true,
        },
        phone: {
            type: type.STRING,
            unique: true,
        },
        password: type.STRING,
        avatar: type.STRING,
        lastSeen: type.DATE
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);