
"use strict";
const Repository = require("../../Repository");
const { News } = require("../../../database/sequelize");
class NewsRepository extends Repository {
    constructor() {
        super(News);

    }

    async get(page, limit) {
        const offset = limit * (page - 1);
        const query = {};
        if (offset && offset > 0)
            query.offset = offset;
        query.limit = limit;
        const news = await News.findAll();
        console.log(news, '---------from news----------')
        return News.findAll({
            order: [['id', 'DESC']],
            ...query
        });
    }
}
module.exports = (new NewsRepository());