"use strict";


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
    }
    create(payload){
        return this.Model.create(payload);
    }

    find(id){
        return this.Model.findByPk(id);
    }

    findOne(condition){
        return this.Model.findOne({where: condition});
    }

    update(condition, update){
        return this.Model.update(update,{where:condition})
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

    getModel(){
        return this.Model;
    }
}

module.exports = Repository;