const Repository = require("../Repository");
const {Callback} = require("../../database/sequelize");

class CallbackRepository extends Repository{
    constructor(){
        super(Callback);
    }

    create( phone, name ){
        return this.Model.create({
            phone,
            name,
            // id: Math.ceil( Date.now/ Math.random()),
        })
    }
}


module.exports = (new CallbackRepository());