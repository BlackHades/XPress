"use strict";
const Op = require("sequelize").Op;

class Repository{
    constructor(Model){
        this.Model = Model;
        this.all = this.all.bind(this);
        this.update = this.update.bind(this);
        this.findOne = this.findOne.bind(this);
        this.find = this.find.bind(this);
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
        this.truncate = this.truncate.bind(this);
        this.bulkCreate = this.bulkCreate.bind(this);
        this.upsert = this.upsert.bind(this);
        this.paginate = this.paginate.bind(this);
        this.findOneWithPassword = this.findOneWithPassword.bind(this);
        // this.findOe = this.findOneWithPassword.bind(this);
    }
    create(payload){
        return this.Model.create(payload);
    }

    find(id){
        return this.Model.findByPk(id);
    }

    findOrCreate(condition, defaults){
        return this.Model.findOrCreate({where:condition,defaults});
    }

    findOne(condition){
        return this.Model.findOne({where: condition});
    }
    findOneWithPassword(condition){
        return this.Model.scope("withPassword").findOne({where:condition});
    }
    update(condition, update){
        return this.Model.update(update,{where:condition})
    }

    findIn(key, values = []){
        return this.Model.findAll({
            where:{
                [key]: {
                    [Op.in]: values
                }
            }
        })
    }

    findAll(condition){
        return this.Model.findAll({where:condition})
    }
    all(condition){
        return this.Model.findAll(condition);
    };

    destroy(condition){
        return this.Model.destroy({where:condition});
    }

    truncate(condition){
        if(process.env.APP_ENV == "development"){
            return this.Model.truncate({where:condition});
        }
    }

    bulkCreate(payload = []){
        return this.Model.bulkCreate(payload);
    }

    upsert(payload){
        return this.Model.upsert(payload, {returning: true});
    }

    paginate(condition = {}, page, limit){
        const offset = limit * (page - 1);
        const query = {};
        if(offset && offset > 0)
            query.offset = offset;
        query.limit = limit;
        return this.Model.findAll({
            where: condition,
            order: [['id', 'DESC']],
            ...query
        });
    }

    getModel(){
        return this.Model;
    }
}

module.exports = Repository;