const Repository = require("../Repository");
const {Ratings} = require("../../database/sequelize");

class RatingsRepository extends Repository{
    constructor(){
        super(Ratings);
    }

    create(rating, comment, userId, agentId ){
        return this.Model.create({
            rating,
            comment,
            userId,
            agentId,
            // id: Math.ceil( Date.now/ Math.random()),
        })
    }
}


module.exports = (new RatingsRepository());