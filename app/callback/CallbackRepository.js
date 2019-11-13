const Repository = require("../Repository");
const { Callback } = require("../../database/sequelize");

class CallbackRepository extends Repository {
    constructor() {
        super(Callback);
    }

    create(phone, name) {
        return this.Model.create({
            phone,
            name,
            // id: Math.ceil( Date.now/ Math.random()),
        })
    }

    all() {
        return this.Model.findAll({ order: [['id', 'DESC']] })
    };
}


module.exports = (new CallbackRepository());