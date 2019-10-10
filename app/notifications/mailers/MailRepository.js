
"use strict";
const Repository = require("../../Repository");
const {Mailer} = require("../../../database/sequelize");
class MailRepository extends Repository{
    constructor(){
        super(Mailer);
    }

    get(page, limit){
        const offset = limit * (page - 1);
        const query = {};
        if(offset && offset > 0)
            query.offset = offset;
        query.limit = limit;
        return this.Model.findAll({
            order: [['id', 'DESC']],
            ...query
        });
    }
}
module.exports = (new MailRepository());